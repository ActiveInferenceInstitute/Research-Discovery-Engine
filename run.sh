#!/usr/bin/env bash
#
# Repository gate — the single entry point for every check this repository runs.
#
# Each arm is one command, and it is the same command `.github/workflows/ci.yml`
# invokes: the workflow calls this script, it does not restate the commands.
#
#   ./run.sh fast      credential-free test harness subsets (unit, integration, validation)
#   ./run.sh build     DE production build, including the knowledge-base assertion
#   ./run.sh website   website_explore_the_unknown production build (Next.js)
#   ./run.sh python    path/ analysis run + website Flask API check, each in a fresh uv env
#   ./run.sh docs      relative Markdown links, anchors and Publishing artifact digests
#   ./run.sh gnn       pinned GNN parser conformance (see .github/GNN.md)
#   ./run.sh lint      ESLint over DE/ (known red: pre-existing findings, see docs)
#   ./run.sh types     tsc -b over DE/ (known red: pre-existing errors, see docs)
#   ./run.sh all       fast + build + website + python + docs + gnn (the CI blocking set)
#   ./run.sh strict    all + lint + types
#   ./run.sh metrics   re-measure every arm and regenerate Docs/GATE_METRICS.md
#
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DE_DIR="$ROOT/DE"
WEBSITE_DIR="$ROOT/website_explore_the_unknown"
PYTHON="${PYTHON:-python3}"
GATE_PYTHON_VERSION="${GATE_PYTHON_VERSION:-3.12}"
LOG_DIR="$ROOT/.gate/logs"

usage() {
  sed -n '3,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "run.sh: $1 is required for this arm but is not on PATH" >&2
    return 1
  }
}

require_node_modules() {
  local dir="$1"
  [ -d "$dir/node_modules" ] || {
    echo "run.sh: $dir/node_modules is missing; run 'npm ci' in $dir first" >&2
    return 1
  }
}

# --- arms -------------------------------------------------------------------

arm_fast() {
  require_command node
  require_node_modules "$DE_DIR"
  local tsx="$DE_DIR/node_modules/.bin/tsx"
  [ -x "$tsx" ] || {
    echo "run.sh: $tsx is missing; run 'npm ci' in DE/ first" >&2
    return 1
  }
  mkdir -p "$LOG_DIR"
  # run-tests.ts exits 0 even when tests fail, so the reported failure count is
  # the gate, not the exit status. The llm subset needs a provider key and is
  # deliberately not part of this arm.
  local type log
  for type in unit integration validation; do
    log="$LOG_DIR/$type.log"
    ( cd "$DE_DIR" && "$tsx" scripts/run-tests.ts --test-type "$type" ) | tee "$log"
    if ! grep -q "Failed: 0" "$log"; then
      echo "run.sh: $type reported failures" >&2
      return 1
    fi
  done
}

arm_build() {
  require_command npm
  require_node_modules "$DE_DIR"
  ( cd "$DE_DIR" && npm run build )
}

arm_website() {
  require_command npm
  require_node_modules "$WEBSITE_DIR"
  ( cd "$WEBSITE_DIR" && npm run build )
}

# Install one component's requirements.txt into a fresh environment under
# .gate/ and print its interpreter. Never the contributor's own environment:
# the arm checks exactly what that manifest resolves to today.
component_python() {
  local venv="$ROOT/.gate/venv-$1"
  uv venv --quiet --clear --python "$GATE_PYTHON_VERSION" "$venv" >&2
  uv pip install --quiet --python "$venv/bin/python" -r "$2" >&2
  printf '%s\n' "$venv/bin/python"
}

arm_python() {
  require_command uv
  local python scratch outputs written
  # path/: the whole research-path analysis over DE/KG, written to a scratch
  # directory (the script writes relative to its working directory).
  python="$(component_python path "$ROOT/path/requirements.txt")"
  scratch="$(mktemp -d)"
  ( cd "$scratch" && MPLBACKEND=Agg "$python" -B "$ROOT/path/research_paths.py" )
  outputs="$scratch/knowledge_graph_final_definitive"
  written="$(find "$outputs" -type f -size +0 | wc -l | tr -d ' ')"
  if [ "$written" -eq 0 ] || [ -n "$(find "$outputs" -type f -size 0 -print -quit)" ]; then
    echo "run.sh: path/research_paths.py wrote no output or an empty file" >&2
    rm -rf "$scratch"
    return 1
  fi
  rm -rf "$scratch"
  echo "path: research_paths.py completed over DE/KG and wrote $written non-empty files"
  # website_explore_the_unknown/: the Flask API, without credentials or network.
  python="$(component_python website "$WEBSITE_DIR/requirements.txt")"
  "$python" -B "$ROOT/scripts/gate/website_api_smoke.py" "$WEBSITE_DIR"
}

arm_docs() {
  require_command "$PYTHON"
  (
    cd "$ROOT"
    local checker=( "$PYTHON" scripts/gate/identity.py
      --schema Docs/workflows/record-identity.schema.json
      --contract Docs/workflows/publishing.md )
    "${checker[@]}"
    local artifact
    for artifact in Docs/workflows/record-identity.schema.json \
      scripts/gate/identity.py scripts/gate/identity_selftest.py .github/gnn-pin.json; do
      "${checker[@]}" --verify-copy "$artifact"
    done
    "$PYTHON" scripts/gate/identity_selftest.py
    echo "identity: selftest passed (matching copy accepted; drifted copy rejected)"
  )
  "$PYTHON" "$ROOT/scripts/check_docs_links.py"
}

arm_gnn() {
  require_command "$PYTHON"
  # The verdict selftest runs first: it proves the accepted set (only literal
  # True) without network, the pinned environment, or repository state.
  "$PYTHON" "$ROOT/scripts/gnn_conformance_selftest.py"
  "$PYTHON" "$ROOT/scripts/gnn_conformance.py"
}

arm_lint() {
  require_command npm
  require_node_modules "$DE_DIR"
  ( cd "$DE_DIR" && npm run lint )
}

arm_types() {
  require_command npx
  require_node_modules "$DE_DIR"
  ( cd "$DE_DIR" && npx tsc -b --pretty false )
}

arm_metrics() {
  require_command "$PYTHON"
  "$PYTHON" "$ROOT/scripts/gate_metrics.py"
}

# --- dispatch ---------------------------------------------------------------

main() {
  local arm="${1:-}"
  if [ -z "$arm" ]; then
    usage
    return 2
  fi
  shift

  case "$arm" in
    fast) arm_fast "$@" ;;
    build) arm_build "$@" ;;
    website) arm_website "$@" ;;
    python) arm_python "$@" ;;
    docs) arm_docs "$@" ;;
    gnn) arm_gnn "$@" ;;
    lint) arm_lint "$@" ;;
    types) arm_types "$@" ;;
    metrics) arm_metrics "$@" ;;
    all)
      arm_fast
      arm_build
      arm_website
      arm_python
      arm_docs
      arm_gnn
      ;;
    strict)
      arm_fast
      arm_build
      arm_website
      arm_python
      arm_docs
      arm_gnn
      arm_lint
      arm_types
      ;;
    help|-h|--help)
      usage
      ;;
    *)
      echo "run.sh: unknown arm '$arm'" >&2
      usage >&2
      return 2
      ;;
  esac
}

main "$@"

#!/usr/bin/env python3
"""Credential-free check of the website's Flask API (`./run.sh python`).

Run with the interpreter that `./run.sh python` installs from
`website_explore_the_unknown/requirements.txt`. It proves that the pinned
packages install together, that every module under `api/` compiles, that the
route modules import against the installed SDKs (Flask, Flask-Cors, supabase,
mistralai), and that both app entry points answer requests that never leave the
process:

- `GET /api/flask_check` returns 200 from `api/index.py` and `api/index_bp.py`;
- `POST /api/subscribe` with a malformed address is refused with 400 by input
  validation, before any database call.

Supabase and Mistral settings are replaced with loopback placeholders, so the
check can neither read a contributor's credentials nor reach a real project.
"""

from __future__ import annotations

import importlib
import os
import sys
from pathlib import Path

PLACEHOLDER_ENV = {
    "NEXT_PUBLIC_SUPABASE_URL": "http://127.0.0.1:9",
    "SUPABASE_SERVICE_ROLE_KEY": "gate-placeholder-not-a-key",
}
WITHHELD_ENV = ("MISTRAL_API_KEY", "NODE_ENV")


def fail(message: str) -> int:
    print(f"website-api: {message}", file=sys.stderr)
    return 1


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        return fail("usage: website_api_smoke.py WEBSITE_DIR")
    api_dir = Path(argv[1]).resolve() / "api"
    if not api_dir.is_dir():
        return fail(f"{api_dir} is not a directory")

    os.environ.update(PLACEHOLDER_ENV)
    for name in WITHHELD_ENV:
        os.environ.pop(name, None)
    # The modules call load_dotenv(), which never overrides variables that are
    # already set; running from api/ keeps it away from a contributor's .env.
    os.chdir(api_dir)
    sys.dont_write_bytecode = True

    # Compile in memory so the check leaves no bytecode in the tree.
    modules = sorted(api_dir.rglob("*.py"))
    for path in modules:
        try:
            compile(path.read_bytes(), str(path), "exec", dont_inherit=True)
        except SyntaxError as error:
            return fail(f"{path.relative_to(api_dir.parent)} does not compile: {error}")
    print(f"website-api: {len(modules)} modules under api/ compile")

    sys.path.insert(0, str(api_dir))
    for module in ("routes.flask_check", "routes.subscribe", "routes.chat"):
        importlib.import_module(module)

    for entry in ("index", "index_bp"):
        client = importlib.import_module(entry).app.test_client()
        response = client.get("/api/flask_check")
        if response.status_code != 200 or (response.get_json() or {}).get("status") != "success":
            return fail(f"{entry}: GET /api/flask_check returned {response.status_code}")
        response = client.post("/api/subscribe", json={"email": "not-an-address"})
        if response.status_code != 400:
            return fail(f"{entry}: malformed POST /api/subscribe returned {response.status_code}, expected 400")
        print(f"website-api: {entry}.app answers flask_check (200) and refuses a malformed subscribe (400)")

    print("website-api: the route modules import against the installed requirements")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

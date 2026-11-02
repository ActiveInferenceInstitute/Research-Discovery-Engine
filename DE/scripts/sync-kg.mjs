#!/usr/bin/env node
/**
 * The application fetches its knowledge base at runtime as `/KG/<file>.md` and
 * its publication records as `/KG/publications/<key>.md` (see
 * `src/utils/cnmBuilder.ts` and `src/hooks/useAppState.ts`). Vite serves
 * `public/` as-is and copies it into `dist/` at build time, so the canonical
 * records in `KG/` and `publications/` are mirrored into `public/KG/` here.
 *
 * The mirror is generated, never committed: `public/KG/` is ignored by git.
 *
 *   node scripts/sync-kg.mjs                 mirror public/KG/ from the sources
 *   node scripts/sync-kg.mjs --check-dist    assert the built dist/KG/ carries it
 *
 * Both forms exit non-zero when a document is missing.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KG_SOURCE = join(appRoot, 'KG');
const PUBLICATIONS_SOURCE = join(appRoot, 'publications');
const MIRROR = join(appRoot, 'public', 'KG');
const checkDist = process.argv.includes('--check-dist');

const markdownIn = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith('.md')).sort() : [];

const documents = markdownIn(KG_SOURCE);
const publications = markdownIn(PUBLICATIONS_SOURCE);

function fail(message) {
  console.error(`[sync-kg] ${message}`);
  process.exit(1);
}

function assertMirror(target, label) {
  const missingDocuments = documents.filter((name) => !existsSync(join(target, name)));
  if (missingDocuments.length > 0) {
    fail(
      `${label} is missing ${missingDocuments.length} of ${documents.length} knowledge-base documents: ` +
        missingDocuments.join(', ')
    );
  }
  const missingPublications = publications.filter(
    (name) => !existsSync(join(target, 'publications', name))
  );
  if (missingPublications.length > 0) {
    fail(
      `${label} is missing ${missingPublications.length} of ${publications.length} publication records ` +
        `(first: ${missingPublications[0]})`
    );
  }
  console.log(
    `[sync-kg] ${label}: ${documents.length} knowledge-base documents and ` +
      `${publications.length} publication records present`
  );
}

function sync() {
  rmSync(MIRROR, { recursive: true, force: true });
  mkdirSync(MIRROR, { recursive: true });
  for (const name of documents) {
    cpSync(join(KG_SOURCE, name), join(MIRROR, name));
  }
  if (publications.length > 0) {
    mkdirSync(join(MIRROR, 'publications'), { recursive: true });
    for (const name of publications) {
      cpSync(join(PUBLICATIONS_SOURCE, name), join(MIRROR, 'publications', name));
    }
  }
  assertMirror(MIRROR, 'public/KG');
}

if (documents.length === 0) {
  fail(`no knowledge-base documents found in ${KG_SOURCE}`);
}

if (checkDist) {
  if (!existsSync(join(appRoot, 'dist'))) {
    fail('dist/ does not exist, so the built output cannot be checked');
  }
  assertMirror(join(appRoot, 'dist', 'KG'), 'dist/KG');
} else {
  sync();
}

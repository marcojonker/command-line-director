# command-line-director — AGENTS.md

## What this is

An npm library (`command-line-director` v2.0.0) that parses CLI arguments into typed commands for Node.js applications. Published to npm.

## Developer commands

```
npm test          # Jest with coverage
npm run lint      # ESLint (flat config, eslint.config.mjs)
npm run lint:fix  # ESLint auto-fix
npm run build     # tsup → dist/ (cjs + esm + dts)
npm run prepare   # runs build (triggered by npm install)
npm run changelog # auto-changelog → CHANGELOG.md
```

CI order: `lint → prepare (build) → test`.

## Architecture

- **Single entrypoint**: `src/index.ts` re-exports all 8 modules.
- **Core classes**:
  - `CommandLineDirector` — top-level container; `parse()` reads `process.argv.slice(2)`, `generateHelp()` prints usage.
  - `CommandLine` — represents one command with an identifier, title, description, and array of arguments.
  - `CommandLineArgument` — individual argument definition (type, validation, defaults).
  - `CommandLineArgumentFactory` — convenience factory for common argument types.
- **Directories**: `src/` (library source), `test/` (Jest specs, `*.spec.ts`), `dist/` (build output, gitignored), `samples/` (usage examples).
- **Build**: `tsup` produces `dist/index.js` (cjs), `dist/index.mjs` (esm), `dist/index.d.ts`. The `tsconfig.json` `outDir` (`./lib`) is unused — tsup controls output.
- **Node engine**: `>=18.0.0`.

## Testing

- Framework: Jest + ts-jest, Node environment (`jest.config.ts`).
- Test files: `test/*.spec.ts` — match by filename, not by directory convention.
- Run single test: `npm test -- -t "test name"` or `npm test -- test/file.spec.ts`.
- ESLint ignores `test/` and `samples/` — no lint on test code.

## Release flow

- Manual workflow via `.github/workflows/release.yml` (workflow_dispatch on `master`).
- Release types: `minor`, `patch`, `beta`, `major`.
- Beta uses `npm version prerelease --preid=beta` and `npm publish --tag beta`.
- Requires `NPM_TOKEN` secret. Supports `--dry-run`.

## Gotchas

- The README sample uses `require('../lib/…')` paths (old CommonJS output), but current build outputs to `dist/`. Samples are illustrative only.
- `tsconfig.json` has `outDir: "./lib"` but tsup overrides to `dist/`. Do not rely on `lib/` existing.
- Flag arguments are internally stored as `KeyValue` type with value `true` — not a separate parsing path.
- `parse()` iterates command lines in definition order and returns the **first** match. Order matters when configuring commands.

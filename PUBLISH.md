Publish checklist

- Bump version in `package.json` (e.g. `npm version patch`)
- Run tests: `npm test`
- Build: `npm run build`
- Verify package contents: `npm pack --dry-run` or `npm pack` to create a tarball
- Publish: `npm publish` (ensure correct npm registry and auth)

Optionally add CI steps to run tests and publish from a release pipeline.

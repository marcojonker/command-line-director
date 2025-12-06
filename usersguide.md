# Command Line Director — User Guide

This user guide explains how to install, use, and integrate the `command-line-director` library in your Node.js (JavaScript / TypeScript) projects. It provides quick examples to get started and an API overview for common tasks.

---

## Table of contents

- Introduction
- Installation
- Quickstart (JavaScript)
- Quickstart (TypeScript)
- API reference
  - `CommandLineDirector`
  - `CommandLine`
  - `CommandLineArgumentFactory`
- Examples
  - Key/value arguments
  - Flags
  - Positional (value) arguments
  - Generating help text
- CLI usage and samples
- Publishing & packaging notes
- Troubleshooting

---

## Introduction

`command-line-director` helps you map CLI input to named commands with typed and validated arguments. Use it to configure multiple commands, validate inputs (allowed values, regex), and generate help text.

The library supports:
- Key/value arguments (e.g. `--id=12`)
- Flag arguments (e.g. `--verbose`)
- Positional value arguments (e.g. `open file.txt`)
- Validation with allowed value lists and regular expressions
- Help text generation

---

## Installation

Install from npm:

```bash
npm install command-line-director
```

For development (if contributing or building locally) you'll typically install dev dependencies and build:

```bash
npm install
npm run build
```

---

## Quickstart (JavaScript)

Basic example using CommonJS (require):

```js
const {
  CommandLineDirector,
  CommandLine,
  CommandLineArgumentFactory
} = require('command-line-director')

const argFactory = new CommandLineArgumentFactory()

const commands = [
  new CommandLine('list-identifier', 'List', 'List items', [
    argFactory.valueArgument('command', 'command', true, ['list']),
    argFactory.flagArgument('delete', 'delete the list', '--delete', '-d')
  ])
]

const director = new CommandLineDirector('My CLI', 'Example CLI', commands)

const parsed = director.parse(true) // `true` enables verbose errors
if (parsed) {
  console.log(parsed.identifier, parsed.values)
} else {
  console.log('No matching command')
}
```

Run (from the command line):

```bash
node ./dist/index.js list -d
```

---

## Quickstart (TypeScript)

Install the types (if not bundled) and import using ESM-style imports:

```ts
import { CommandLineDirector, CommandLine, CommandLineArgumentFactory } from 'command-line-director'

const factory = new CommandLineArgumentFactory()
const command = new CommandLine('open', 'Open', 'Open an item', [
  factory.valueArgument('command', 'command', true, ['open']),
  factory.keyValueArgument('id', 'identifier', false, '--id', '-i')
])

const director = new CommandLineDirector('CLI', 'desc', [command])
const parsed = director.parse(true)
if (parsed) {
  // TypeScript knows parsed.values is a Map<string, unknown>
  console.log(parsed.identifier, parsed.values.get('id'))
}
```

---

## API reference

This is a short overview of the primary classes.

### `CommandLineDirector`

Constructor: `new CommandLineDirector(title: string, description: string, commandLines: CommandLine[])`

Main methods:
- `parse(verbose?: boolean): Command | null` — Parse `process.argv.slice(2)` and return a matched `Command` or `null`. If `verbose` is `true` it will log validation errors.
- `parseArguments(cmdArguments: string[], verbose: boolean): Command | null` — Parse a provided arguments array (useful for testing).
- `generateHelp(): string` — Returns a formatted help string describing all commands/arguments.

Return: `Command` object contains at least:
- `identifier` — the command identifier
- `values` — a Map of argument property names to parsed values


### `CommandLine`

Represents a single command configuration.
Constructor: `new CommandLine(identifier: string, title: string, description: string, commandLineArguments: CommandLineArgument[])`

Used to declare a command with its arguments.

### `CommandLineArgumentFactory`

Factory to build arguments quickly:
- `keyValueArgument(propertyName, description, required, argName, alias?, defaultValue?, allowedValues?, regex?)`
- `flagArgument(propertyName, description, argName, alias?)`
- `valueArgument(propertyName, description, required, allowedValues?, regex?)`

Use these to produce instances suitable for passing to `CommandLine`.

---

## Examples

### Key/value arguments

```js
const argFactory = new CommandLineArgumentFactory()
const cmd = new CommandLine('add', 'Add', 'Add item', [
  argFactory.keyValueArgument('item', 'Item name', true, '--item', '-i'),
  argFactory.keyValueArgument('priority', 'Priority', false, '--priority', '-p', 'normal', ['low','normal','high'])
])
```

Usage:
```
node app.js add --item="MyTask" --priority=high
```

### Flags

```js
argFactory.flagArgument('force', 'Force action', '--force', '-f')
```

Usage:
```
node app.js add --item=MyTask --force
```

### Positional value arguments

```js
argFactory.valueArgument('command', 'command', true, ['open'])
argFactory.valueArgument('file', 'file to open', true)
```

Usage:
```
node app.js open "./path/to/file.txt"
```

### Generating help text

Call `director.generateHelp()` to get a formatted string you can print:

```js
console.log(director.generateHelp())
```

---

## CLI usage and samples

- To debug parsing locally, call `parseArguments` with a sample array:

```js
// example for tests
const command = director.parseArguments(['--item=abc', '--priority=low'], true)
```

- Use the `verbose` flag to print validation errors while authoring commands.

---

## Publishing & packaging notes

- The project includes a build step that emits ESM/CJS bundles and type declarations (`dist/`).
- The `prepare` script runs the build automatically before publishing.
- To verify what will be published without actually publishing, run:

```bash
npm pack --dry-run
```

- When publishing, bump the `package.json` `version` (for example `npm version patch`) and run `npm publish`.

A more detailed checklist is in `PUBLISH.md` in the repository root.

---

## Troubleshooting

- If arguments are not recognized, enable verbose parsing (`parse(true)`) to see validation messages.
- If you're using TypeScript, ensure you import from the package root and that your build step generated `.d.ts` files.
- For unknown runtime errors in `parse`, the library will surface messages; ensure your argument definitions (required/allowedValues/regex) match expected input.

---

If you'd like, I can:
- Add more examples with complete runnable sample applications (in `samples/`),
- Expand the API reference with full TypeScript signatures and return types, or
- Add the guide contents into `README.md` instead of a separate `usersguide.md`.

If you want any of those, tell me which and I'll add them.

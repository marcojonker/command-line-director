# Command Line Director

## Goal

The **Command Line Director** project provides a TypeScript/JavaScript framework for creating command-line applications with structured argument parsing, validation, and help generation. It enables developers to build robust CLI tools that can handle various types of command-line arguments (flags, key-value pairs, positional values) with type safety and validation.

## Features

- **Modular Architecture**: Built with TypeScript for type safety and maintainability
- **Flexible Argument Types**: Support for flags, key-value arguments, and positional values
- **Type Safety**: Strong typing for arguments (string, number, boolean)
- **Validation**: Built-in validation for required fields, allowed values, and regex patterns
- **Help Generation**: Automatic generation of help text with clear formatting
- **Error Handling**: Detailed error messages for debugging command-line issues
- **Cross-Platform**: Works with Node.js 18+

## Architecture

The project follows a **modular architecture** with the following key components:

### Core Components

1. **CommandLineDirector**: The main orchestrator that manages command lines, parses arguments, and generates help text
2. **CommandLine**: Represents a specific command with its arguments and validation rules
3. **CommandLineArgument**: Defines individual arguments with their properties, types, and validation constraints
4. **CommandLineArgumentFactory**: Factory class for creating different types of command-line arguments
5. **Command**: Represents the parsed result of a command line execution
6. **ArgumentLookup**: Helper class for parsing and organizing command-line arguments

### Data Types and Enums

- **CommandLineArgumentDataType**: Enum for argument data types (String, Number, Boolean)
- **CommandLineArgumentType**: Enum for argument types (KeyValue, Value)

### TypeScript Configuration

- **ES Modules**: Uses modern ES module syntax
- **Type Declarations**: Generates `.d.ts` files for TypeScript support
- **Dual Builds**: Supports both CommonJS and ESM module formats

The architecture follows the **Single Responsibility Principle** with clear separation of concerns between argument definition, parsing, validation, and execution.

## Getting Started

### Prerequisites

- Node.js
- npm

### Coding Conventions

#### TypeScript Best Practices
- Use **ES6+ features** and modern TypeScript syntax
- Follow **strict type checking** with `strict: true` in tsconfig.json
- Use **interfaces** and **types** for complex data structures
- Implement proper **error handling** with custom error classes

#### Code Style
- Follow **TypeScript ESLint rules** (configured in eslint.config.mjs)
- Use **consistent naming conventions**: camelCase for variables/functions, PascalCase for classes/interfaces
- Write **JSDoc comments** for all public methods and classes
- Use **consistent indentation** (2 spaces)

#### Testing
- Write **unit tests** for all new features using Jest
- Test **edge cases** and **error conditions**
- Maintain **test coverage** above 80%
- Use **mocking** for external dependencies

#### Documentation
- Keep **README.md** and **CHANGELOG.md** up to date
- Document **public APIs** with JSDoc comments
- Include **code examples** in documentation

### Available Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `npm run build` | Compiles TypeScript to JavaScript and generates type definitions | Production build |
| `npm test` | Runs the test suite with coverage | `npm test` |
| `npm run lint` | Lints the codebase using ESLint | `npm run lint` |
| `npm run lint:fix` | Automatically fixes linting issues | `npm run lint:fix` |
| `npm run changelog` | Generates changelog from git history | `npm run changelog` |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

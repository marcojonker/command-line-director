import { CommandLineDirector, CommandLine, CommandLineArgumentFactory } from '../src/index';

// TypeScript sample using the library source directly
const factory = new CommandLineArgumentFactory();

const commands = [
  new CommandLine('greet', 'Greet', 'Greet someone', [
    factory.valueArgument('command', 'command', true, ['greet']),
    factory.keyValueArgument('name', 'name to greet', true, '--name', '-n')
  ])
];

const director = new CommandLineDirector('TS Sample CLI', 'TS demonstration', commands);

// Example: parse a sample argument array (useful for testing)
const example = director.parseArguments(['greet', '--name=TypeScriptUser'], true);
if (example) {
  console.log('Matched (example):', example.identifier);
  console.log('Values:', Object.fromEntries(example.values));
} else {
  console.log('No match for example args');
}

// When run via ts-node you can also parse process.argv:
// const runtime = director.parseArguments(process.argv.slice(2), true);
// console.log(runtime);

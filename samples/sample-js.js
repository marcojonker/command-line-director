// Simple CommonJS sample that uses the built bundle in `dist/`
const { CommandLineDirector, CommandLine, CommandLineArgumentFactory } = require('../dist');

const argFactory = new CommandLineArgumentFactory();

const commands = [
  new CommandLine('greet', 'Greet', 'Greet someone', [
    argFactory.valueArgument('command', 'command', true, ['greet']),
    argFactory.keyValueArgument('name', 'name to greet', true, '--name', '-n')
  ])
];

const director = new CommandLineDirector('Sample CLI', 'Demonstration of command-line-director', commands);

// parse actual CLI args when run from node
const parsed = director.parseArguments(process.argv.slice(2), true);
if (parsed) {
  const values = Object.fromEntries(parsed.values);
  console.log(`Matched: ${parsed.identifier}`);
  console.log('Values:', values);
} else {
  console.log('No matching command. Help:');
  console.log(director.generateHelp());
}

# COMMAND LINE DIRECTOR #

The command line director give direction to you command line arguments. With the command line director you can configure, validate and direct the command line argument supported by your nodejs command line application.

# QUICKSTART #

**STEP 1:** Install
```
npm install command-line-director
```

**STEP 2:** Add the command line director to your application (see chapter 'sample')

**STEP 3:** Run your application

# CONFIGURATION #

The configuration the the command line director exists of 3 classes. The CommandLineDirector that contains a set of CommandLines. Each CommandLine exists of one or more CommandLineArguments.

## Configuring the CommandLineDirector

The command line direction the class that contains all the application's command line and maps the input argument to a specific Command. It also contain a title and a description of the application, which is printed a the top of the generated help. For an example see the chapter 'sample'. The CommandLineDirector has 2 public functions:

* parse(verbose) - To parse the current command line arguments to a specific command. If verbose is true information about why a command is not found is printen at stdout
* generateHelp - To Generate a help text

## Configuring a CommandLine

A command line the configuration of a set of arguments that defines a specific command. It also contains a title and a description of a CommandLine, which is printed in the generated Help. For an example see the chapter 'sample'.

## Configuring a CommandLineArgument ##

The most used types of argument can be defined using the CommandLineArgument factory. The factory can be used to create a key value argument, a flag argument and a value argument.

### Key value argument ###

A key value argument is a string argument with a key. The key value argument can be define with the following properties:

* propertyName - Name of the property that will contain the value when the command is parsed
* description - Description of the flag that is displayed in the command line help
* argumentName - Name of the argument in the command line (exmaple: '--test-flag')
* alias - Alias for the name of the argument (example: '-tf')
* required - Value is required or optional
* allowedValues - Array of allowed values
* regularExpression - regular expression for validating the value

Sample of creating a value argument:

```
const argumentFactory = new CommandLineArgumentFactory()
argumentFactory.keyValueArgument('testValue', 'Used for testing', true, '--test-value', '-tv', ['test1', 'test2'], new RegEx('^A-Z*$'))
```

### Flag argument ###

A flag argument a boolean argument. If a flag is present in the command line argument the boolean value will be set to true. The flag argument can be define with the following properties:

* propertyName - Name of the property that will contain the value when the command is parsed
* description - Description of the flag that is displayed in the command line help
* argumentName - Name of the argument in the command line (exmaple: '--test-flag')
* alias - Alias for the name of the argument (example: '-tf')

Sample of creating a flag argument:

```
const argumentFactory = new CommandLineArgumentFactory()
argumentFactory.flagArgument('testFlag', 'Used for testing', '--test-flag', '-tf')
```

### Value argument ###

A value argument is a string argument without a key. A value argument can be detected by allowed values, a regex or just by value. A usecase can be passing a file path a last argument. The value argument can be define with the following properties:

* propertyName - Name of the property that will contain the value when the command is parsed
* description - Description of the flag that is displayed in the command line help
* required - Value is required or optional
* allowedValues - Array of allowed values
* regularExpression - regular expression for validating the value

Sample of creating a value argument:

```
const argumentFactory = new CommandLineArgumentFactory()
argumentFactory.valueArgument('testValue', 'Used for testing', true, ['test1', 'test2'], new RegEx('^A-Z*$'))
```

# Sample #
This is an example that can handle the following commands:
* node ./samples/app ?
* node ./samples/app.js open "from-path"
* node ./samples/app.js cf --from="from-path" -to="to-path"
* node ./samples/app.js cf --remove-source --from="from-path" -to="to-path"
* node ./samples/app.js cf -rs -f="from-path" -t="to-path"

```
const CommandLineDirector = require('../lib/command-line-director')
const CommandLine = require('../lib/command-line')
const CommandLineArgumentFactory = require('../lib/command-line-argument-factory')

class App {
    constructor() {
        const argumentFactory = new CommandLineArgumentFactory()

        const commandLines = [
            // node ./samples/app ?
            new CommandLine('help-identifier', 'Help', 'Show help', [
                argumentFactory.valueArgument('command', '?', true, ['?']),
            ]),
            // node ./samples/app.js open "from-path"
            new CommandLine('open-identifier', 'Open', 'Open a file', [
                argumentFactory.valueArgument('command', 'Open command', true, ['open']),
                argumentFactory.valueArgument('fileName', 'Name of the file to open', true),
            ]),
            // node ./samples/app.js cf --from="from-path" -to="to-path"
            // node ./samples/app.js cf --remove-source --from="from-path" -to="to-path"
            // node ./samples/app.js cf -rs -f="from-path" -t="to-path"
            new CommandLine('copy-file-identifier', 'Copy', 'Copy a file', [
                argumentFactory.valueArgument('command', 'Copy file command', true, ['cf']),
                argumentFactory.flagArgument('removeSource', 'Remove the source file', '--remove-source', '-rs'),
                argumentFactory.keyValueArgument('from', 'From path', true, '--from', '-f'),
                argumentFactory.keyValueArgument('to', 'To path', true, '--to', '-t'),
            ]),
        ]

        this.commandLineDirector = new CommandLineDirector(
            'File functions', 
            'A coomand line tool for special file operations', 
            commandLines)
    }

    run() {
        const command = this.commandLineDirector.parse()

        if(command) {
            switch(command.identifier) {
                case 'help-identifier':
                    console.log(this.commandLineDirector.generateHelp())
                    break
                case 'open-identifier':
                    console.log(`Open a file with values: ${JSON.stringify(command.values)}`)
                    break
                case 'copy-file-identifier':
                    console.log(`Copy a file with values: ${JSON.stringify(command.values)}`)
                    break
                default:
                    console.error('unknown command')
                    break
            }
        } else {
            console.error('unknown command')
        }
    }
}

const app = new App()
app.run()
```


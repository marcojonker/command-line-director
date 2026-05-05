import { CommandLineDirector } from '../src/command-line-director';
import { CommandLine } from '../src/command-line';
import { CommandLineArgumentFactory } from '../src/command-line-argument-factory';

class App {
    private commandLineDirector: CommandLineDirector;

    constructor() {
        const argumentFactory = new CommandLineArgumentFactory()

        const commandLines = [
            // node ./samples/app ?
            new CommandLine('help-identifier', 'Help', 'Show help', [
                argumentFactory.stringValueArgument('command', '?', true, ['?']),
            ]),
            // node ./samples/app.js open "from-path"
            new CommandLine('open-identifier', 'Open', 'Open a file', [
                argumentFactory.stringValueArgument('command', 'Open command', true, ['open']),
                argumentFactory.stringValueArgument('fileName', 'Name of the file to open', true),
            ]),
            // node ./samples/app.js cf --from="from-path" -to="to-path"
            // node ./samples/app.js cf --remove-source --from="from-path" -to="to-path"
            // node ./samples/app.js cf -rs -f="from-path" -t="to-path"
            new CommandLine('copy-file-identifier', 'Copy', 'Copy a file', [
                argumentFactory.stringValueArgument('command', 'Copy file command', true, ['cf']),
                argumentFactory.flagArgument('removeSource', 'Remove the source file', '--remove-source', '-rs'),
                argumentFactory.keyStringValueArgument('from', 'From path', true, '--from', '-f'),
                argumentFactory.keyStringValueArgument('to', 'To path', true, '--to', '-t'),
            ]),
            // node ./samples/app.js helloworld
            // node ./samples/app.js helloworld --name=Alice
            // node ./samples/app.js helloworld -n=Bob
            new CommandLine('helloworld-identifier', 'HelloWorld', 'Print a hello world message', [
                argumentFactory.stringValueArgument('command', 'Hello world command', true, ['helloworld']),
                argumentFactory.keyStringValueArgument('name', 'Name to greet', false, '--name', '-n'),
            ]),
        ]

        this.commandLineDirector = new CommandLineDirector('File functions', 'A coomand line tool for special file operations', commandLines)
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
                    console.log(`Copy a file with values: ${JSON.stringify(command.values)}`);
                    break
                case 'helloworld-identifier':
                    console.log(`Hello, ${command.values.get('name') || 'World'}!`);
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
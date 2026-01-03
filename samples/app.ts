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
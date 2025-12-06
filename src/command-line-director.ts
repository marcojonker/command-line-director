import { CommandLine } from './command-line';
import { Command } from './command';
import { ArgumentLookup } from './argument-lookup';

export class CommandLineDirector {
  private title: string;
  private description: string;
  private commandLines: CommandLine[];

  constructor (title: string, description: string, commandLines: CommandLine[]) {
    this.title = title
    this.description = description
    if (Array.isArray(commandLines)) {
      this.commandLines = commandLines
    } else {
      throw new Error("Invalid argument 'commandLines', value should be of type 'array'")
    }
  }

  private removeQuotes(text: string): string {
    return text.replace(/['"]+/g, '')
  }

  private createArgumentLookupFromProcessArguments (cmdArguments: string[]): ArgumentLookup {
    const lookup = new ArgumentLookup()

    cmdArguments.forEach((cmdArgument) => {
      const keyValue = cmdArgument.split('=')
      // Flag of key value type
      if (typeof keyValue[0] === 'string' && keyValue[0].charAt(0) === '-') {
        const value = keyValue.length === 2 ? this.removeQuotes(keyValue[1]) : true
        const keyName = keyValue[0]
        lookup.keyValues.set(keyName, value)
        // Value type
      } else {
        lookup.values.push(this.removeQuotes(cmdArgument))
      }
    })

    return lookup
  }

  parseArguments (cmdArguments: string[], verbose: boolean): Command | null {
    const lookup = this.createArgumentLookupFromProcessArguments(cmdArguments)
    let command = null

    for (let i = 0; i < this.commandLines.length; i++) {
      const commandLine = this.commandLines[i]
      try {
        command = commandLine.commandFromLookup(lookup)
        break
      } catch (error: unknown) {  
        if (verbose) {
          if (error instanceof Error) {
            console.info(error.message)
          } else {
            console.info(String(error))
          }
        }
        command = null
      }
    };

    return command
  }

  parse (verbose: boolean = false): Command | null {
    return this.parseArguments(process.argv.slice(2), verbose)
  }

  generateHelp () {
    let help = '\r\n=======================================================================\r\n'
    help += `\r\n${this.title.toUpperCase()}\r\n${this.description}\r\n\r\n`

    for (const commandLine of this.commandLines) {
      help += '-----------------------------------------------------------------------\r\n'
      help += `${commandLine.title.toUpperCase()} - ${commandLine.description}\r\n\r\n`


      for (const argument of commandLine.commandLineArguments) {
        help += `${argument.toString()}\r\n`
      }
      help += '\r\n'
    }

    help += '=======================================================================\r\n'
    return help
  }
}


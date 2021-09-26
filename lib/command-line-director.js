const Command = require('./command')

class CommandLineDirector {
  constructor (title, description, commandLines) {
    this.title = title
    this.description = description
    if (Array.isArray(commandLines)) {
      this.commandLines = commandLines
    } else {
      throw new Error("Invalid argument 'commandLines', value should be of type 'array'")
    }
  }

  _removeQuotes (text) {
    return text.replace(/['"]+/g, '')
  }

  _createArgumentLookupFromProcessArguments (cmdArguments) {
    const lookup = {
      values: [],
      keyValues: {}
    }

    cmdArguments.forEach((cmdArgument) => {
      const keyValue = cmdArgument.split('=')
      // Flag of key value type
      if (typeof keyValue[0] === 'string' && keyValue[0].charAt(0) === '-') {
        const value = keyValue.length === 2 ? this._removeQuotes(keyValue[1]) : true
        const keyName = keyValue[0]
        lookup.keyValues[keyName] = value
        // Value type
      } else {
        lookup.values.push(this._removeQuotes(cmdArgument))
      }
    })

    return lookup
  }

  parseArguments (cmdArguments, verbose) {
    const lookup = this._createArgumentLookupFromProcessArguments(cmdArguments)
    let command = null

    for (let i = 0; i < this.commandLines.length; i++) {
      const commandLine = this.commandLines[i]
      try {
        command = commandLine.commandFromLookup(lookup)
        break
      } catch (error) {
        if (verbose) {
          console.info(error.message)
        }
        command = null
      }
    };

    return command
  }

  parse (verbose) {
    return this.parseArguments(process.argv.slice(2), verbose)
  }

  generateHelp () {
    let help = '\r\n=======================================================================\r\n'
    help += `\r\n${this.title.toUpperCase()}\r\n${this.description}\r\n\r\n`

    this.commandLines.forEach((commandLine) => {
      help += '-----------------------------------------------------------------------\r\n'
      help += `${commandLine.title.toUpperCase()} - ${commandLine.description}\r\n\r\n`

      commandLine.commandLineArguments.forEach((argument) => {
        help += `${argument.toString()}\r\n`
      })
      help += '\r\n'
    })

    help += '=======================================================================\r\n'
    return help
  }
}

module.exports = CommandLineDirector

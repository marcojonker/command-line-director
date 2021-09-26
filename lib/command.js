class Command {
  constructor (identifier, commandLineArguments, values) {
    this.identifier = identifier
    this.commandLineArguments = commandLineArguments
    this.values = values
  }
}

module.exports = Command

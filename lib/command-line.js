const CommandLineArgumentDataType = require('./command-line-argument-data-type')
const CommandLineArgumentType = require('./command-line-argument-type')
const Command = require('./command')

class CommandLine {
  /**
     * CommandLine constructor
     * @param identifier - string
     * @param commandLineArguments - array
     * @thows Error
     */
  constructor (identifier, title, description, commandLineArguments) {
    this.identifier = identifier
    this.title = title
    this.description = description
    this.commandLineArguments = []
    if (Array.isArray(commandLineArguments)) {
      this.commandLineArguments = commandLineArguments
    } else {
      throw new Error("Invalid argument 'commandLineArguments', value should be of type 'array'")
    }
  }

  /**
     * Create lookup table for process arguments
     * @result object
     */

  _parseDataType (value, dataType) {
    let parsedValue = null

    if (value !== undefined && value !== null) {
      switch (dataType) {
        case CommandLineArgumentDataType.Boolean:
          parsedValue = Boolean(value)
          break
        case CommandLineArgumentDataType.Number:
          parsedValue = Number(value)
          if (isNaN(parsedValue)) {
            parsedValue = null
          }
          break
        case CommandLineArgumentDataType.String:
          parsedValue = String(value)
          break
        default: {
          throw new Error(`Unknown data type '${dataType}.`)
        }
      }

      if (parsedValue === null) {
        throw new Error(`Could not parse value '${value}' to data type '${dataType}.`)
      }
    }

    return parsedValue
  }

  /**
     * Create command from argument lookup
     * @param argument lookup
     * @result command
     * @throws Error
     */
  commandFromLookup (argumentLookup) {
    const result = {}
    const values = argumentLookup.values
    const keyValues = argumentLookup.keyValues
    let valueIndex = 0

    // Check all the arguments
    this.commandLineArguments.forEach((arg) => {
      if (arg.type === CommandLineArgumentType.KeyValue) {
        if (keyValues[arg.argumentName] !== undefined) {
          result[arg.propertyName] = keyValues[arg.argumentName]
        } else if (keyValues[arg.alias] !== undefined) {
          result[arg.propertyName] = keyValues[arg.alias]
        }
      } else if (arg.type === CommandLineArgumentType.Value) {
        if (values.length > valueIndex) {
          result[arg.propertyName] = values[valueIndex]
          valueIndex++
        }
      } else {
        throw new Error('Invalid command line argument type')
      }

      // Set the default value if avaiable
      if (result[arg.propertyName] === undefined && arg.defaultValue !== undefined) {
        result[arg.propertyName] = arg.defaultValue
      }

      // Parse data to the correct data type
      if (result[arg.propertyName] !== undefined) {
        result[arg.propertyName] = this._parseDataType(result[arg.propertyName], arg.dataType)
      }
    })

    // Check all the arguments
    this.commandLineArguments.forEach(function (arg) {
      // Check if required field exists
      if (arg.required === true && (result[arg.propertyName] === undefined || result[arg.propertyName] === null)) {
        throw new Error(`Required field '${arg.propertyName}' is missing.`)
      }

      // Check if value is allowed
      if (arg.allowedValues && (arg.required === true || (result[arg.propertyName] !== undefined && result[arg.propertyName] !== null))) {
        if (arg.allowedValues.indexOf(result[arg.propertyName]) === -1) {
          throw new Error(`Value for field '${arg.propertyName}' is not allowed.`)
        }
      };

      // Check if value meets regex
      if (arg.regularExpression && (arg.required === true || (result[arg.propertyName] !== undefined && result[arg.propertyName] !== null))) {
        if (!arg.regularExpression.test(result[arg.propertyName])) {
          throw new Error(`Value for field field '${arg.propertyName}' is invalid.`)
        }
      }
    })

    return new Command(this.identifier, this.commandLineArguments, result)
  }
}

module.exports = CommandLine


import { Command } from './command'
import { CommandLineArgumentDataType } from './command-line-argument-data-type'
import { CommandLineArgumentType } from './command-line-argument-type'
import { CommandLineArgument } from './command-line-argument'
import { ArgumentLookup } from './argument-lookup'

export class CommandLine {
  public identifier: string
  public title: string
  public description: string
  public commandLineArguments: CommandLineArgument[]

  /**
     * CommandLine constructor
     * @param identifier - string
     * @param commandLineArguments - array
     * @thows Error
     */
  constructor (identifier: string, title: string, description: string, commandLineArguments: CommandLineArgument[]) {
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

  private parseDataType (value: any, dataType: CommandLineArgumentDataType) {
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
  commandFromLookup (argumentLookup: ArgumentLookup): Command {
    const result = new Map<string, any>()
    const values = argumentLookup.values
    const keyValues = argumentLookup.keyValues
    let valueIndex = 0

    // Check all the arguments
    this.commandLineArguments.forEach((arg) => {
      if (arg.type === CommandLineArgumentType.KeyValue) {
        if (arg.argumentName &&keyValues.has(arg.argumentName)) {
          result.set(arg.propertyName, keyValues.get(arg.argumentName))
        } else if (arg.alias && keyValues.has(arg.alias)) {
          result.set(arg.propertyName, keyValues.get(arg.alias))
        }
      } else if (arg.type === CommandLineArgumentType.Value) {
        if (values.length > valueIndex) {
          result.set(arg.propertyName, values[valueIndex])
          valueIndex++
        }
      } else {
        throw new Error('Invalid command line argument type')
      }

      // Set the default value if avaiable
      if (result.has(arg.propertyName) === false && arg.defaultValue !== null) {
        result.set(arg.propertyName, arg.defaultValue)
      }

      // Parse data to the correct data type
      if (result.has(arg.propertyName)) {
        result.set(arg.propertyName, this.parseDataType(result.get(arg.propertyName), arg.dataType))
      }
    })

    // Check all the arguments
    this.commandLineArguments.forEach(function (arg) {
      // Check if required field exists
      if (arg.required === true && (result.get(arg.propertyName) === undefined || result.get(arg.propertyName) === null)) {
        throw new Error(`Required field '${arg.propertyName}' is missing.`)
      }

      // Check if value is allowed
      if (arg.allowedValues && (arg.required === true || (result.has(arg.propertyName) && result.get(arg.propertyName) !== null))) {
        if (arg.allowedValues.indexOf(result.get(arg.propertyName)) === -1) {
          throw new Error(`Value for field '${arg.propertyName}' is not allowed.`)
        }
      };

      // Check if value meets regex
      if (arg.regularExpression && (arg.required === true || (result.has(arg.propertyName) && result.get(arg.propertyName) !== null))) {
        if (!arg.regularExpression.test(result.get(arg.propertyName))) {
          throw new Error(`Value for field field '${arg.propertyName}' is invalid.`)
        }
      }
    })

    return new Command(this.identifier, this.commandLineArguments, result)
  }
}


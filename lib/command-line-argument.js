const CommandLineArgumentDataType = require('./command-line-argument-data-type')
const CommandLineArgumentType = require('./command-line-argument-type')

class CommandLineArgument {
  /**
     * CommandLineArgument Constructor
     * @param propertyName - string
     * @param required - boolean
     * @param argumentName - string
     * @param alias - string
     * @param dataType - CommandLineArgumentDataType
     * @param type - CommandLineArgumentType
     * @param defaultValue
     * @param allowedValues
     * @param regularExpression
     * @param description
     */
  constructor (propertyName, required, argumentName, alias, dataType, type, defaultValue, allowedValues, regularExpression, description) {
    if (!propertyName) {
      throw new Error("'propertyName' parameter not defined.")
    }

    if (required === undefined || required === null) {
      throw new Error("'required' parameter not defined.")
    }

    if (type !== CommandLineArgumentType.KeyValue && type !== CommandLineArgumentType.Value) {
      throw new Error("'type' parameter invalid.")
    }

    if (!argumentName && type === CommandLineArgumentType.KeyValue) {
      throw new Error("'argumentName' parameter not defined.")
    }

    if (allowedValues && Array.isArray(allowedValues) === false) {
      throw new Error("'allowedValues' parameter should be an array.")
    }

    this.propertyName = propertyName
    this.required = Boolean(required)
    this.argumentName = argumentName
    this.alias = (alias !== undefined) ? alias : null
    this.dataType = dataType || CommandLineArgumentDataType.String
    this.type = type
    this.defaultValue = defaultValue
    this.allowedValues = allowedValues || null
    this.regularExpression = regularExpression || null
    this.description = description
  }

  toString () {
    let help = ''
    let title = ''

    if (this.argumentName) {
      title = `  ${this.argumentName},${this.alias}`
    } else if (this.allowedValues) {
      title = `  ${this.allowedValues}`
    } else {
      title = '  <string>'
    }

    help += title
    for (let i = 0; i < 24 - title.length; i++) {
      help += ' '
    }

    help += ` ${this.required ? 'R' : 'O'} | ${this.dataType}`

    if (this.argumentName && this.allowedValues) {
      help += ` | VALUES = ${this.allowedValues}`
    }

    if (this.regularExpression) {
      help += ` | PATTERN = ${this.regularExpression.toString()}`
    }

    help += ` | ${this.description}`

    return help
  }
}

module.exports = CommandLineArgument

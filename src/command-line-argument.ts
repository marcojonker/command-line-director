import { CommandLineArgumentDataType } from './command-line-argument-data-type'
import { CommandLineArgumentType } from './command-line-argument-type'

export class CommandLineArgument {
  public propertyName: string
  public required: boolean
  public argumentName: string | null
  public alias: string | null
  public dataType: CommandLineArgumentDataType
  public type: CommandLineArgumentType
  public defaultValue: string | number | boolean | null
  public allowedValues: string[] | number[] | boolean[] | null
  public regularExpression: RegExp | null
  public description: string | null

  constructor(
    propertyName: string, 
    required: boolean, 
    argumentName: string | null, 
    alias: string | null, 
    dataType: CommandLineArgumentDataType | null, 
    type: CommandLineArgumentType, 
    defaultValue: string | number | boolean | null = null, 
    allowedValues: string[] | number[] | boolean[] | null = null, 
    regularExpression: RegExp | null = null, 
    description: string | null = null) {
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
    this.alias = (alias !== undefined) ? alias : ''
    this.dataType = dataType ?? CommandLineArgumentDataType.String
    this.type = type
    this.defaultValue = defaultValue
    this.allowedValues = allowedValues ?? []
    this.regularExpression = regularExpression ?? null
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


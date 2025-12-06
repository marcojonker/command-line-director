import { CommandLineArgument } from "./command-line-argument"
import { CommandLineArgumentDataType } from "./command-line-argument-data-type"
import { CommandLineArgumentType } from "./command-line-argument-type"

export class CommandLineArgumentFactory {
    /**s
     * Create string argument
     * Examples:
     * --dir="/var/www/test"
     * -d="/var/www/test"
     *
     * @param propertyName - string
     * @param description - string
     * @param required - boolean
     * @param argumentName - string
     * @param alias - string
     * @param defaultValue - any
     * @param allowedValues
     * @param regularExpression
     */
    keyValueArgument(
        propertyName: string, 
        description: string, 
        required: boolean, 
        argumentName: string, 
        alias: string, 
        defaultValue: string | number | boolean | null = null, 
        allowedValues: string[] | number[] | boolean[] | null = null, 
        regularExpression: RegExp | null = null) {
        return new CommandLineArgument(
            propertyName,
            required,
            argumentName,
            alias,
            CommandLineArgumentDataType.String,
            CommandLineArgumentType.KeyValue,
            defaultValue,
            allowedValues,
            regularExpression,
            description)
    }

    /**
     * Create boolean argument
     * Examples:
     * --force
     * -f
     *
     * @param propertyName - string
     * @param description - string
     * @param argumentName - string
     * @param alias - string
     */
    flagArgument(propertyName: string, description: string, argumentName: string, alias: string) {
        return new CommandLineArgument(
            propertyName,
            false,
            argumentName,
            alias,
            CommandLineArgumentDataType.Boolean,
            CommandLineArgumentType.KeyValue,
            false,
            null,
            null,
            description)
    }

    /**
     * Create command
     * Examples:
     * init
     *
     * @param propertyName - string
     * @param description
     * @param required - boolean
     * @param allowedValues
     * @param regularExpression
     */
    valueArgument(
        propertyName: string, 
        description: string, 
        required: boolean, 
        allowedValues: string[] | number[] | boolean[] | null = null, 
        regularExpression: RegExp | null = null) {
        return new CommandLineArgument(
            propertyName,
            required,
            null,
            null,
            CommandLineArgumentDataType.String,
            CommandLineArgumentType.Value,
            null,
            allowedValues,
            regularExpression,
            description)
    }
}

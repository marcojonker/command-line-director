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
     * @param defaultValue - string
     * @param allowedValues
     * @param regularExpression
     */
    keyStringValueArgument(
        propertyName: string, 
        description: string, 
        required: boolean, 
        argumentName: string, 
        alias: string, 
        defaultValue: string | null = null,
        allowedValues: string[] | null = null, 
        regularExpression: RegExp | null = null) {
        return new CommandLineArgument<string>(
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

    keyNumberValueArgument(
        propertyName: string, 
        description: string, 
        required: boolean, 
        argumentName: string, 
        alias: string, 
        defaultValue: number | null = null, 
        allowedValues: number[] | null = null, 
        regularExpression: RegExp | null = null) {
        return new CommandLineArgument<number>(
            propertyName,
            required,
            argumentName,
            alias,
            CommandLineArgumentDataType.Number,
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
        return new CommandLineArgument<boolean>(
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
    stringValueArgument(
        propertyName: string, 
        description: string, 
        required: boolean, 
        allowedValues: string[] | null = null, 
        regularExpression: RegExp | null = null) {
        return new CommandLineArgument<string>(
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

    numberValueArgument(
        propertyName: string, 
        description: string, 
        required: boolean, 
        allowedValues: number[] | null = null, 
        regularExpression: RegExp | null = null) {
        return new CommandLineArgument<number>(
            propertyName,
            required,
            null,
            null,
            CommandLineArgumentDataType.Number,
            CommandLineArgumentType.Value,
            null,
            allowedValues,
            regularExpression,
            description)
    }    
}

const CommandLineArgumentDataType = require('./command-line-argument-data-type')
const CommandLineArgumentType = require('./command-line-argument-type')
const CommandLineArgument = require('./command-line-argument')

class CommandLineArgumentFactory {
    /**
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
    keyValueArgument(propertyName, description, required, argumentName, alias, defaultValue, allowedValues, regularExpression) {
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
    flagArgument(propertyName, description, argumentName, alias) {
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
    valueArgument(propertyName, description, required, allowedValues, regularExpression) {
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

module.exports = CommandLineArgumentFactory
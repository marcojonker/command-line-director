import { describe, it, expect } from '@jest/globals'
import { CommandLineArgumentFactory } from '../src/command-line-argument-factory'
import { CommandLineArgument } from '../src/command-line-argument'
import { CommandLineArgumentDataType } from '../src/command-line-argument-data-type'
import { CommandLineArgumentType } from '../src/command-line-argument-type'

describe('CommandLineArgumentFactory (unit)', () => {
  const factory = new CommandLineArgumentFactory()

  it('creates a string key-value argument with expected properties', () => {
    const arg = factory.keyStringValueArgument(
      'param1',
      'param1 description',
      true,
      '--param1',
      '-p1',
      'default',
      ['default', 'test'],
      new RegExp('^test$')
    )

    expect(arg).toBeInstanceOf(CommandLineArgument)
    expect(arg.propertyName).toBe('param1')
    expect(arg.required).toBe(true)
    expect(arg.argumentName).toBe('--param1')
    expect(arg.alias).toBe('-p1')
    expect(arg.dataType).toBe(CommandLineArgumentDataType.String)
    expect(arg.type).toBe(CommandLineArgumentType.KeyValue)
    expect(arg.defaultValue).toBe('default')
    expect(arg.allowedValues).toEqual(['default', 'test'])
    expect(arg.regularExpression?.toString()).toBe('/^test$/')
  })

  it('creates a number key-value argument with expected properties', () => {
    const arg = factory.keyNumberValueArgument(
      'num',
      'num description',
      false,
      '--num',
      '-n',
      10,
      [10, 20],
    )

    expect(arg.propertyName).toBe('num')
    expect(arg.required).toBe(false)
    expect(arg.dataType).toBe(CommandLineArgumentDataType.Number)
    expect(arg.defaultValue).toBe(10)
    expect(arg.allowedValues).toEqual([10, 20])
  })

  it('creates a flag argument with boolean default false', () => {
    const arg = factory.flagArgument('force', 'force description', '--force', '-f')

    expect(arg.propertyName).toBe('force')
    expect(arg.required).toBe(false)
    expect(arg.dataType).toBe(CommandLineArgumentDataType.Boolean)
    expect(arg.defaultValue).toBe(false)
    expect(arg.argumentName).toBe('--force')
    expect(arg.alias).toBe('-f')
  })

  it('creates a string value argument (positional) with expected properties', () => {
    const arg = factory.stringValueArgument('cmd', 'cmd description', true, ['a', 'b'], null)

    expect(arg.propertyName).toBe('cmd')
    expect(arg.type).toBe(CommandLineArgumentType.Value)
    expect(arg.argumentName).toBeNull()
    expect(arg.alias).toBeNull()
    expect(arg.allowedValues).toEqual(['a', 'b'])
  })

  it('creates a number value argument (positional) with expected properties', () => {
    const arg = factory.numberValueArgument('numcmd', 'num description', false, [1, 2, 3], new RegExp('^[0-9]+$'))

    expect(arg.propertyName).toBe('numcmd')
    expect(arg.type).toBe(CommandLineArgumentType.Value)
    expect(arg.dataType).toBe(CommandLineArgumentDataType.Number)
    expect(arg.argumentName).toBeNull()
    expect(arg.alias).toBeNull()
    expect(arg.allowedValues).toEqual([1, 2, 3])
    expect(arg.regularExpression?.toString()).toBe('/^[0-9]+$/')
  })

  it('handles null allowedValues and null regularExpression by using defaults', () => {
    const arg = factory.numberValueArgument('numcmd2', 'num description', true)

    expect(arg.propertyName).toBe('numcmd2')
    expect(arg.dataType).toBe(CommandLineArgumentDataType.Number)
    // constructor normalizes null allowedValues to empty array
    expect(arg.allowedValues).toEqual([])
    // constructor keeps null regularExpression as null
    expect(arg.regularExpression).toBeNull()
  })

  it('handles null allowedValues and null regularExpression for key number arguments', () => {
    const arg = factory.keyNumberValueArgument('numkey', 'num description', false, '--numkey', '-n')

    expect(arg.propertyName).toBe('numkey')
    expect(arg.dataType).toBe(CommandLineArgumentDataType.Number)
    expect(arg.argumentName).toBe('--numkey')
    expect(arg.allowedValues).toEqual([])
    expect(arg.regularExpression).toBeNull()
  })

  
})

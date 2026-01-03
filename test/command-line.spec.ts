import { describe, it, expect } from '@jest/globals'
import { CommandLine } from '../src/command-line'
import { CommandLineArgumentFactory } from '../src/command-line-argument-factory'
import { ArgumentLookup } from '../src/argument-lookup'
import { CommandLineArgumentDataType } from '../src/command-line-argument-data-type'
import { CommandLineArgumentType } from '../src/command-line-argument-type'

describe('CommandLine', () => {
  const factory = new CommandLineArgumentFactory()

  it('parses key-value, positional and flag arguments and applies defaults and types', () => {
    const args = [
      factory.keyStringValueArgument('param1', 'p1', true, '--param1', '-p1'),
      factory.keyNumberValueArgument('param2', 'p2', false, '--param2', '-p2', 200, [200, 201]),
      factory.flagArgument('param3', 'p3', '--param3', '-p3')
    ]

    const cl = new CommandLine('id', 't', 'd', args)
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('--param1', 'abc')
    lookup.keyValues.set('--param2', '200')
    lookup.keyValues.set('--param3', true)

    const cmd = cl.commandFromLookup(lookup)
    expect(cmd.values.get('param1')).toBe('abc')
    expect(cmd.values.get('param2')).toBe(200)
    expect(cmd.values.get('param3')).toBe(true)
  })

  it('applies default value when not provided', () => {
    const args = [factory.keyStringValueArgument('p', 'p', false, '--p', '-p', 'def')]
    const cl = new CommandLine('id', 't', 'd', args)
    const lookup = new ArgumentLookup()

    const cmd = cl.commandFromLookup(lookup)
    expect(cmd.values.get('p')).toBe('def')
  })

  it('throws when required field is missing', () => {
    const args = [factory.keyStringValueArgument('must', 'm', true, '--must', '-m')]
    const cl = new CommandLine('id', 't', 'd', args)
    const lookup = new ArgumentLookup()

    expect(() => cl.commandFromLookup(lookup)).toThrow("Required field 'must' is missing.")
  })

  it('throws when value is not allowed', () => {
    const args = [factory.keyNumberValueArgument('n', 'n', true, '--n', '-n', null, [1, 2])]
    const cl = new CommandLine('id', 't', 'd', args)
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('--n', '3')

    expect(() => cl.commandFromLookup(lookup)).toThrow("Value for field 'n' is not allowed.")
  })

  it('throws when regex validation fails', () => {
    const args = [factory.keyStringValueArgument('s', 's', true, '--s', '-s', null, null, new RegExp('^[0-9]+$'))]
    const cl = new CommandLine('id', 't', 'd', args)
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('--s', 'abc')

    expect(() => cl.commandFromLookup(lookup)).toThrow("Value for field field 's' is invalid.")
  })

  it('throws when argument type is invalid', () => {
    // create a fake argument with an invalid type
    const fakeArg: any = {
      type: 999,
      propertyName: 'x',
      defaultValue: null,
      dataType: CommandLineArgumentDataType.String,
      required: false,
      argumentName: null,
      alias: null,
      allowedValues: [],
      regularExpression: null
    }

    const cl = new CommandLine('id', 't', 'd', [fakeArg])
    const lookup = new ArgumentLookup()

    expect(() => cl.commandFromLookup(lookup)).toThrow('Invalid command line argument type')
  })

  it('throws when number parsing fails', () => {
    const args = [factory.keyNumberValueArgument('num', 'num', true, '--num', '-n')]
    const cl = new CommandLine('id', 't', 'd', args)
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('--num', 'not-a-number')

    expect(() => cl.commandFromLookup(lookup)).toThrow(/Could not parse value/)
  })

  it('uses alias when argumentName not present but alias is provided', () => {
    const args = [
      factory.keyNumberValueArgument('n', 'n', true, '--n', '-n')
    ]
    const cl = new CommandLine('id', 't', 'd', args)
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('-n', '42')

    const cmd = cl.commandFromLookup(lookup)
    expect(cmd.values.get('n')).toBe(42)
  })

  it('applies default for missing positional values when provided', () => {
    // two positional args, second has default
    const pos1 = factory.stringValueArgument('p1', 'p1', true)
    const pos2 = factory.numberValueArgument('p2', 'p2', false, null, null)
    pos2.defaultValue = 5 as any

    const cl = new CommandLine('id', 't', 'd', [pos1, pos2])
    const lookup = new ArgumentLookup()
    lookup.values.push('first')

    const cmd = cl.commandFromLookup(lookup)
    expect(cmd.values.get('p1')).toBe('first')
    expect(cmd.values.get('p2')).toBe(5)
  })

  it('does not enforce allowedValues when allowedValues is empty', () => {
    const arg = factory.keyNumberValueArgument('n', 'n', true, '--n', '-n', null, [])
    const cl = new CommandLine('id', 't', 'd', [arg])
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('--n', '999')

    // should parse number and not throw even though 999 is not in allowedValues
    const cmd = cl.commandFromLookup(lookup)
    expect(cmd.values.get('n')).toBe(999)
  })

  it('does not run regex check when value is missing and not required', () => {
    const arg = factory.keyStringValueArgument('s', 's', false, '--s', '-s', null, null, /^[0-9]+$/)
    const cl = new CommandLine('id', 't', 'd', [arg])
    const lookup = new ArgumentLookup()

    // missing value should not cause regex check
    const cmd = cl.commandFromLookup(lookup)
    expect(cmd.values.get('s')).toBeUndefined()
  })

  it('handles key present but value undefined (argumentName) as null', () => {
    const arg = factory.keyStringValueArgument('a', 'a', false, '--a', '-a')
    const cl = new CommandLine('id', 't', 'd', [arg])
    const lookup = new ArgumentLookup()
    // set value to undefined explicitly
    lookup.keyValues.set('--a', undefined as any)

    const cmd = cl.commandFromLookup(lookup)
    expect(cmd.values.has('a')).toBe(true)
    expect(cmd.values.get('a')).toBeNull()
  })

  it('handles key present but value undefined (alias) as null', () => {
    const arg = factory.keyStringValueArgument('b', 'b', false, '--b', '-b')
    const cl = new CommandLine('id', 't', 'd', [arg])
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('-b', undefined as any)

    const cmd = cl.commandFromLookup(lookup)
    expect(cmd.values.has('b')).toBe(true)
    expect(cmd.values.get('b')).toBeNull()
  })

  it('accepts value when it is present in allowedValues', () => {
    const arg = factory.keyNumberValueArgument('n', 'n', true, '--n', '-n', null, [200])
    const cl = new CommandLine('id', 't', 'd', [arg])
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('--n', '200')

    const cmd = cl.commandFromLookup(lookup)
    expect(cmd.values.get('n')).toBe(200)
  })

  it('throws when string value is not allowed', () => {
    const arg = factory.keyStringValueArgument('s', 's', true, '--s', '-s', null, ['a', 'b'])
    const cl = new CommandLine('id', 't', 'd', [arg])
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('--s', 'c')

    expect(() => cl.commandFromLookup(lookup)).toThrow("Value for field 's' is not allowed.")
  })

  it('skips allowedValues check when value is null', () => {
    const arg = factory.keyStringValueArgument('s2', 's2', false, '--s2', '-s2', null, ['a'])
    const cl = new CommandLine('id', 't', 'd', [arg])
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('--s2', undefined as any)

    const cmd = cl.commandFromLookup(lookup)
    expect(cmd.values.get('s2')).toBeNull()
  })

  it("constructor throws when 'commandLineArguments' is not an array", () => {
    // @ts-ignore - pass invalid value
    expect(() => new CommandLine('id', 't', 'd', {})).toThrow("Invalid argument 'commandLineArguments', value should be of type 'array'")
  })

  it('throws Unknown data type when dataType is invalid', () => {
    const fakeArg: any = {
      type: CommandLineArgumentType.KeyValue,
      propertyName: 'x',
      defaultValue: null,
      dataType: 999,
      required: false,
      argumentName: '--x',
      alias: null,
      allowedValues: [],
      regularExpression: null
    }

    const cl = new CommandLine('id', 't', 'd', [fakeArg])
    const lookup = new ArgumentLookup()
    lookup.keyValues.set('--x', 'v')

    expect(() => cl.commandFromLookup(lookup)).toThrow("Unknown data type '999.")
  })
})

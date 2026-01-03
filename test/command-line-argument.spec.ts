import { describe, it, expect } from '@jest/globals'
import { CommandLineArgument } from '../src/command-line-argument'
import { CommandLineArgumentDataType } from '../src/command-line-argument-data-type'
import { CommandLineArgumentType } from '../src/command-line-argument-type'

describe('CommandLineArgument', () => {
  // constructor validation is exercised by higher-level code; focus unit tests on defaults and string output

  it('throws when type is invalid', () => {
    // @ts-ignore - pass an invalid enum value
    expect(() => new CommandLineArgument('p', true, null, null, CommandLineArgumentDataType.String, 999, null, null)).toThrow("'type' parameter invalid.")
  })

  it('throws when KeyValue type has no argumentName', () => {
    // @ts-ignore - create KeyValue without argumentName
    expect(() => new CommandLineArgument('p', true, null, null, CommandLineArgumentDataType.String, CommandLineArgumentType.KeyValue, null, null)).toThrow("'argumentName' parameter not defined.")
  })

  it('throws when allowedValues is not an array', () => {
    // @ts-ignore - pass invalid allowedValues
    expect(() => new CommandLineArgument('p', true, '--p', null, CommandLineArgumentDataType.String, CommandLineArgumentType.KeyValue, null, {})).toThrow("'allowedValues' parameter should be an array.")
  })

  it('normalizes defaults (alias, dataType, allowedValues, regularExpression)', () => {
    // alias undefined -> '' ; dataType null -> String ; allowedValues null -> [] ; regularExpression null -> null
    // @ts-ignore - pass null for dataType
    const arg = new CommandLineArgument('p', false, null, undefined, null, CommandLineArgumentType.Value, null, null, null, 'desc')

    expect(arg.alias).toBe('')
    expect(arg.dataType).toBe(CommandLineArgumentDataType.String)
    expect(arg.allowedValues).toEqual([])
    expect(arg.regularExpression).toBeNull()
    expect(arg.description).toBe('desc')
  })

  it('toString contains argumentName, alias, required flag, dataType, values, pattern and description when present', () => {
    const arg = new CommandLineArgument('p', true, '--p', '-p', CommandLineArgumentDataType.String, CommandLineArgumentType.KeyValue, null, ['a', 'b'], new RegExp('^x$'), 'desc')
    const s = arg.toString()

    expect(s.includes('--p,-p')).toBe(true)
    expect(s.includes(' R ')).toBe(true)
    expect(s.includes(`${CommandLineArgumentDataType.String}`)).toBe(true)
    expect(s.includes('VALUES = a,b')).toBe(true)
    expect(s.includes('PATTERN = /^x$/')).toBe(true)
    expect(s.includes('desc')).toBe(true)
  })

  it('toString shows allowedValues for positional arguments', () => {
    const arg = new CommandLineArgument('p2', false, null, null, CommandLineArgumentDataType.String, CommandLineArgumentType.Value, null, ['x', 'y'], null, 'd2')
    const s = arg.toString()

    expect(s.includes('x,y')).toBe(true)
    expect(s.includes(' O ')).toBe(true)
    expect(s.includes('d2')).toBe(true)
  })

  it('toString uses <string> title when no argumentName and no allowedValues', () => {
    const arg = new CommandLineArgument('p4', false, null, null, CommandLineArgumentDataType.String, CommandLineArgumentType.Value, null, ['x'], null, 'd4')
    // simulate absence of allowedValues (constructor normalizes null to [])
    arg.allowedValues = null as any

    const s = arg.toString()
    expect(s.includes('<string>')).toBe(true)
    expect(s.includes(' O ')).toBe(true)
    expect(s.includes('d4')).toBe(true)
  })
})

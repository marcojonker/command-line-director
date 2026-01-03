import { describe, it, expect } from '@jest/globals'
import { CommandLineDirector } from '../src/command-line-director'
import { Command } from '../src/command'
import { ArgumentLookup } from '../src/argument-lookup'
import { CommandLine } from '../src/command-line'
import { CommandLineArgumentFactory } from '../src/command-line-argument-factory'

describe('CommandLineDirector (unit)', () => {
  it("constructor throws when 'commandLines' is not an array", () => {
    // @ts-ignore - pass invalid value
    expect(() => new CommandLineDirector('t', 'd', {})).toThrow("Invalid argument 'commandLines', value should be of type 'array'")
  })

  it('parses process arguments into key-values and values (removes quotes)', () => {
    const args = ['--a=1', '-b', 'value1', '"quoted"']

    const stub = {
      commandFromLookup: (lookup: ArgumentLookup) => {
        expect(lookup.keyValues.get('--a')).toBe('1')
        expect(lookup.keyValues.get('-b')).toBe(true)
        expect(lookup.values[0]).toBe('value1')
        expect(lookup.values[1]).toBe('quoted')

        return new Command('ok', [], new Map())
      }
    }

    const director = new CommandLineDirector('t', 'd', [stub as any])
    const result = director.parseArguments(args, false)
    expect(result).not.toBeNull()
    expect(result?.identifier).toBe('ok')
  })

  it('continues to next command when one throws and logs error when verbose', () => {
    const throwing = {
      commandFromLookup: () => { throw new Error('boom') }
    }

    const ok = {
      commandFromLookup: () => new Command('success', [], new Map())
    }

    const calls: any[] = []
    const orig = console.info
    // capture console.info calls
    // @ts-ignore
    console.info = (m: any) => calls.push(m)

    const director = new CommandLineDirector('t', 'd', [throwing as any, ok as any])
    const result = director.parseArguments(['--a=1'], true)

    expect(calls.length).toBeGreaterThan(0)
    expect(calls[0]).toBe('boom')
    expect(result).not.toBeNull()
    expect(result?.identifier).toBe('success')

    // restore
    // @ts-ignore
    console.info = orig
  })

  it('returns null when all commands throw and does not log when verbose is false', () => {
    const t1 = { commandFromLookup: () => { throw new Error('e1') } }
    const t2 = { commandFromLookup: () => { throw new Error('e2') } }

    const calls: any[] = []
    const orig = console.info
    // capture console.info calls
    // @ts-ignore
    console.info = (m: any) => calls.push(m)

    const director = new CommandLineDirector('t', 'd', [t1 as any, t2 as any])
    const result = director.parseArguments(['--a=1'], false)

    expect(result).toBeNull()
    expect(calls.length).toBe(0)

    // restore
    // @ts-ignore
    console.info = orig
  })

  it('generateHelp contains headers, descriptions and argument lines', () => {
    const factory = new CommandLineArgumentFactory()

    const commandLines = [
      new CommandLine('one', 'Title One', 'Description One', [
        factory.keyStringValueArgument('param1', 'param1 description', true, '--param1', '-p1'),
        factory.stringValueArgument('pos1', 'pos1 description', false, ['a', 'b'])
      ]),
      new CommandLine('two', 'Title Two', 'Description Two', [
        factory.flagArgument('flag', 'flag description', '--flag', '-f')
      ])
    ]

    const director = new CommandLineDirector('My App', 'An app description', commandLines)
    const help = director.generateHelp()

    expect(help.includes('MY APP')).toBe(true)
    expect(help.includes('An app description')).toBe(true)
    expect(help.includes('TITLE ONE')).toBe(true)
    expect(help.includes('TITLE TWO')).toBe(true)
    expect(help.includes('--param1,-p1')).toBe(true)
    expect(help.includes('a,b')).toBe(true)
    expect(help.includes('--flag,-f')).toBe(true)
    expect(help.includes('======================================================================')).toBe(true)
  })

  it('parse uses default verbose=false and does not log when command throws', () => {
    const origArgv = process.argv
    process.argv = ['node', 'script', '--a=1']

    const throwing = { commandFromLookup: () => { throw new Error('err-default') } }
    const director = new CommandLineDirector('t', 'd', [throwing as any])

    const calls: any[] = []
    const orig = console.info
    // @ts-ignore
    console.info = (m: any) => calls.push(m)

    const result = director.parse()
    expect(result).toBeNull()
    expect(calls.length).toBe(0)

    // restore
    // @ts-ignore
    console.info = orig
    process.argv = origArgv
  })

  it('parse(true) logs errors when command throws', () => {
    const origArgv = process.argv
    process.argv = ['node', 'script', '--a=1']

    const throwing = { commandFromLookup: () => { throw new Error('err-verbose') } }
    const director = new CommandLineDirector('t', 'd', [throwing as any])

    const calls: any[] = []
    const orig = console.info
    // @ts-ignore
    console.info = (m: any) => calls.push(m)

    const result = director.parse(true)
    expect(result).toBeNull()
    expect(calls.length).toBeGreaterThan(0)
    expect(calls[0]).toBe('err-verbose')

    // restore
    // @ts-ignore
    console.info = orig
    process.argv = origArgv
  })

  it('logs non-Error thrown values via String(error) when verbose', () => {
    const throwing = { commandFromLookup: () => { throw 'non-error' } }
    const ok = { commandFromLookup: () => new Command('success', [], new Map()) }

    const calls: any[] = []
    const orig = console.info
    // @ts-ignore
    console.info = (m: any) => calls.push(m)

    const director = new CommandLineDirector('t', 'd', [throwing as any, ok as any])
    const result = director.parseArguments(['--a=1'], true)

    expect(calls.length).toBeGreaterThan(0)
    expect(calls[0]).toBe('non-error')
    expect(result).not.toBeNull()
    expect(result?.identifier).toBe('success')

    // restore
    // @ts-ignore
    console.info = orig
  })
})

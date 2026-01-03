import { describe, it, expect } from '@jest/globals';
import { CommandLineArgumentFactory } from '../src/command-line-argument-factory';
import { CommandLine } from '../src/command-line';
import { CommandLineDirector } from '../src/command-line-director';

describe('Integration test', function () {
  const argumentFactory = new CommandLineArgumentFactory();

  it('should handle string key value arguments correct', () => {
    const commandLines = [
      new CommandLine('test1', 'title1', 'title1 description', [
        argumentFactory.keyStringValueArgument('param1', 'param1 description', true, '--param1', '-p1'),
        argumentFactory.keyStringValueArgument('param2', 'param2 description', false, '--param2', '-p2', 'defaultParam2', ['defaultParam2', 'test']),
        argumentFactory.keyStringValueArgument('param3', 'param3 description', false, '--param3', '-p3', '100', null, new RegExp('^[0-9]*$')),
        argumentFactory.keyStringValueArgument('param4', 'param4 description', false, '--param4', '-p4')
      ]),
    ]
  
    const commandLineDirector = new CommandLineDirector('title', 'description', commandLines)
  
    let command = commandLineDirector.parseArguments([''], true)
    expect(command).toBe(null);

    // required value set
    command = commandLineDirector.parseArguments(['--param1=test'], true)
    expect(command?.values.get('param1')).toBe('test');
    expect(command?.values.get('param2')).toBe('defaultParam2');
    expect(command?.values.get('param3')).toBe('100');
    expect(command?.values.get('param4')).toBe(undefined);

    // allwed values invalid
    command = commandLineDirector.parseArguments(['--param1=test', '--param2=invalid'], true)
    expect(command).toBe(null);

    // allwed values valid
    command = commandLineDirector.parseArguments(['--param1=test', '--param2=test'], true)
    expect(command?.values.get('param1')).toBe('test');
    expect(command?.values.get('param2')).toBe('test');

    // regex invalid
    command = commandLineDirector.parseArguments(['--param1=test', '--param3=test'], true)
    expect(command).toBe(null);

    // regex valid
    command = commandLineDirector.parseArguments(['--param1=test', '--param3=200'], true)
    expect(command?.values.get('param1')).toBe('test');
    expect(command?.values.get('param3')).toBe('200');

    // not required param
    command = commandLineDirector.parseArguments(['--param1=test', '--param4=test'], true)
    expect(command?.values.get('param1')).toBe('test');
    expect(command?.values.get('param4')).toBe('test');

    // alias
    command = commandLineDirector.parseArguments(['-p1=test1', '-p2=test', '-p3=300', '-p4=test4'], true)
    expect(command?.values.get('param1')).toBe('test1');
    expect(command?.values.get('param2')).toBe('test');
    expect(command?.values.get('param3')).toBe('300');
    expect(command?.values.get('param4')).toBe('test4');
  
    // strip unknown param
    command = commandLineDirector.parseArguments(['-p1=test1', '-p2=test', '-p3=300', '-p4=test4', '--param5=test5'], true)
    expect(command?.values.get('param1')).toBe('test1');
    expect(command?.values.get('param2')).toBe('test');
    expect(command?.values.get('param3')).toBe('300');
    expect(command?.values.get('param4')).toBe('test4');
    expect(command?.values.get('param5')).toBe(undefined);
  });

  it('should handle flag key value arguments correct', () => {
    const commandLines = [
      new CommandLine('test3', 'title3', 'title 3 description', [
        argumentFactory.flagArgument('param1', 'param1 description', '--param1', '-p1')
      ]),
    ]
  
    const commandLineDirector = new CommandLineDirector('title', 'description', commandLines)
  
    let command = commandLineDirector.parseArguments([''], true)
    expect(command?.values.get('param1')).toBe(false);

    command = commandLineDirector.parseArguments(['--param1'], true)
    expect(command?.values.get('param1')).toBe(true);

    command = commandLineDirector.parseArguments(['-p1'], true)
    expect(command?.values.get('param1')).toBe(true);
  });

  it('should handle string value arguments correct', () => {
    const commandLines = [
      new CommandLine('test4', 'title4', 'title 4 description', [
        argumentFactory.stringValueArgument('param1', 'param1 description', true, ['value1', 'value2']),
        argumentFactory.stringValueArgument('param2', 'param2 description', true, ['value3', 'value4']),
        argumentFactory.stringValueArgument('param3', 'param3 description', false, ['value5', 'value6']),
        argumentFactory.stringValueArgument('param4', 'param4 description', false),
      ]),
    ]
  
    const commandLineDirector = new CommandLineDirector('title', 'description', commandLines)
  
    let command = commandLineDirector.parseArguments([''], true)
    expect(command).toBe(null);

    command = commandLineDirector.parseArguments(['value1'], true)
    expect(command).toBe(null);

    command = commandLineDirector.parseArguments(['value1', 'value4'], true)
    expect(command?.values.get('param1')).toBe('value1');
    expect(command?.values.get('param2')).toBe('value4');

    command = commandLineDirector.parseArguments(['value1', 'value3', 'value6'], true)
    expect(command?.values.get('param1')).toBe('value1');
    expect(command?.values.get('param2')).toBe('value3');
    expect(command?.values.get('param3')).toBe('value6');

    command = commandLineDirector.parseArguments(['value1', 'value3', 'value6', '"http://url.test"'], true)
    expect(command?.values.get('param1')).toBe('value1');
    expect(command?.values.get('param2')).toBe('value3');
    expect(command?.values.get('param3')).toBe('value6');
    expect(command?.values.get('param4')).toBe('http://url.test');
  });  

  it('should generate a help text', () => {
    const commandLines = [
      new CommandLine('test1', 'title1', 'title 1 description', [
        argumentFactory.keyStringValueArgument('param1', 'param1 description', true, '--param1', '-p1'),
        argumentFactory.keyStringValueArgument('param2', 'param2 description', false, '--param2', '-p2', 'defaultParam2', ['defaultParam2', 'test']),
        argumentFactory.keyStringValueArgument('param3', 'param3 description', false, '--param3', '-p3', '100', null, new RegExp('^[0-9]*$')),
        argumentFactory.keyStringValueArgument('param4', 'param4 description', false, '--param4', '-p4')
      ]),
      new CommandLine('test2', 'title2', 'title 2 description', [
        argumentFactory.keyStringValueArgument('param1', 'param1 description', true, '--param1', '-p1'),
        argumentFactory.keyNumberValueArgument('param2', 'param2 description', false, '--param2', '-p2', 200, [200, 201]),
        argumentFactory.keyStringValueArgument('param3', 'param3 description', false, '--param3', '-p3')
      ]),
      new CommandLine('test3', 'title3', 'title 3 description', [
        argumentFactory.flagArgument('param1', 'param1 description', '--param1', '-p1')
      ]),
      new CommandLine('test4', 'title4', 'title 4 description', [
        argumentFactory.stringValueArgument('param1', 'param1 description', true, ['value1', 'value2']),
        argumentFactory.stringValueArgument('param2', 'param2 description', true, ['value3', 'value4']),
        argumentFactory.stringValueArgument('param3', 'param3 description', false, ['value5', 'value6']),
        argumentFactory.stringValueArgument('param4', 'param4 description', false)
      ]),
    ]

    const commandLineDirector = new CommandLineDirector('title', 'description', commandLines)
    const helpText = commandLineDirector.generateHelp();

    expect(helpText.includes('TITLE1')).toBe(true)
    expect(helpText.includes('TITLE2')).toBe(true)
    expect(helpText.includes('TITLE3')).toBe(true)
    expect(helpText.includes('TITLE4')).toBe(true)
    expect(helpText.includes('title 1 description')).toBe(true)
    expect(helpText.includes('param1 descriptio')).toBe(true)
    expect(helpText.includes(' R ')).toBe(true)
    expect(helpText.includes('--param1,-p1')).toBe(true)
  });

  it('should handle realworld example correct', () => {
    const commandLines = [
      new CommandLine('list-identifier', 'List', 'Create a list of items', [
        argumentFactory.stringValueArgument('command', 'command', true, ['list']),
        argumentFactory.flagArgument('delete', 'delete the list', '--delete', '-d'),
      ]),
      new CommandLine('open-identifier', 'Open', 'Open an item', [
        argumentFactory.stringValueArgument('command', 'command', true, ['open', 'display']),
        argumentFactory.flagArgument('all', 'Open all items', '--all', '-a'),
        argumentFactory.keyStringValueArgument('id', 'id to open', false, '--identifier', '-id')
      ]),
      new CommandLine('update-identifier', 'Update', 'Updat an item', [
        argumentFactory.stringValueArgument('command', 'command', true, ['update']),
        argumentFactory.flagArgument('all', 'Open all items', '--all', '-a'),
        argumentFactory.keyStringValueArgument('id', 'id to open', false, '--identifier', '-id')
      ]),
    ]
  
    const commandLineDirector = new CommandLineDirector('File cli', 'file cli description', commandLines)
    const helpText = commandLineDirector.generateHelp();
    expect(helpText.length > 0).toBe(true)

    let command = commandLineDirector.parseArguments(['list', '-d'], true)
    expect(command?.identifier).toBe('list-identifier');
    expect(command?.values.get('command')).toBe('list');
    expect(command?.values.get('delete')).toBe(true);

    command = commandLineDirector.parseArguments(['display', '--all', '--identifier=12'], true)
    expect(command?.identifier).toBe('open-identifier');
    expect(command?.values.get('command')).toBe('display');
    expect(command?.values.get('all')).toBe(true);
    expect(command?.values.get('id')).toBe('12');

    command = commandLineDirector.parseArguments(['update', '-a', '-id=100'], true)
    expect(command?.identifier).toBe('update-identifier');
    expect(command?.values.get('command')).toBe('update');
    expect(command?.values.get('all')).toBe(true);
    expect(command?.values.get('id')).toBe('100');
  });    
});
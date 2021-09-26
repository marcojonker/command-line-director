var assert = require('assert');
const CommandLineDirector = require('../lib/command-line-director')
const CommandLine = require('../lib/command-line')
const CommandLineArgumentFactory = require('../lib/command-line-argument-factory')

describe('Integration test', function () {
  const argumentFactory = new CommandLineArgumentFactory();

  it('should handle string key value arguments correct', () => {
    const commandLines = [
      new CommandLine('test1', 'title1', 'title1 description', [
        argumentFactory.keyValueArgument('param1', 'param1 description', true, '--param1', '-p1'),
        argumentFactory.keyValueArgument('param2', 'param2 description', false, '--param2', '-p2', 'defaultParam2', ['defaultParam2', 'test']),
        argumentFactory.keyValueArgument('param3', 'param3 description', false, '--param3', '-p3', '100', null, new RegExp('^[0-9]*$')),
        argumentFactory.keyValueArgument('param4', 'param4 description', false, '--param4', '-p4')
      ]),
    ]
  
    const commandLineDirector = new CommandLineDirector('title', 'description', commandLines)
  
    let command = commandLineDirector.parseArguments([''], true)
    assert.equal(command, null);

    // required value set
    command = commandLineDirector.parseArguments(['--param1=test'], true)
    assert.equal(command.values['param1'], 'test');
    assert.equal(command.values['param2'], 'defaultParam2');
    assert.equal(command.values['param3'], '100');
    assert.equal(command.values['param4'], undefined);

    // allwed values invalid
    command = commandLineDirector.parseArguments(['--param1=test', '--param2=invalid'], true)
    assert.equal(command, null);

    // allwed values valid
    command = commandLineDirector.parseArguments(['--param1=test', '--param2=test'], true)
    assert.equal(command.values['param1'], 'test');
    assert.equal(command.values['param2'], 'test');

    // regex invalid
    command = commandLineDirector.parseArguments(['--param1=test', '--param3=test'], true)
    assert.equal(command, null);

    // regex valid
    command = commandLineDirector.parseArguments(['--param1=test', '--param3=200'], true)
    assert.equal(command.values['param1'], 'test');
    assert.equal(command.values['param3'], '200');

    // not required param
    command = commandLineDirector.parseArguments(['--param1=test', '--param4=test'], true)
    assert.equal(command.values['param1'], 'test');
    assert.equal(command.values['param4'], 'test');

    // alias
    command = commandLineDirector.parseArguments(['-p1=test1', '-p2=test', '-p3=300', '-p4=test4'], true)
    assert.equal(command.values['param1'], 'test1');
    assert.equal(command.values['param2'], 'test');
    assert.equal(command.values['param3'], '300');
    assert.equal(command.values['param4'], 'test4');
  
    // strip unknown param
    command = commandLineDirector.parseArguments(['-p1=test1', '-p2=test', '-p3=300', '-p4=test4', '--param5=test5'], true)
    assert.equal(command.values['param1'], 'test1');
    assert.equal(command.values['param2'], 'test');
    assert.equal(command.values['param3'], '300');
    assert.equal(command.values['param4'], 'test4');
    assert.equal(command.values['param5'], undefined);
  });

  it('should handle flag key value arguments correct', () => {
    const commandLines = [
      new CommandLine('test3', 'title3', 'title 3 description', [
        argumentFactory.flagArgument('param1', 'param1 description', '--param1', '-p1')
      ]),
    ]
  
    const commandLineDirector = new CommandLineDirector('title', 'description', commandLines)
  
    let command = commandLineDirector.parseArguments([''], true)
    assert.equal(command.values['param1'], false);

    command = commandLineDirector.parseArguments(['--param1'], true)
    assert.equal(command.values['param1'], true);

    command = commandLineDirector.parseArguments(['-p1'], true)
    assert.equal(command.values['param1'], true);
  });

  it('should handle string value arguments correct', () => {
    const commandLines = [
      new CommandLine('test4', 'title4', 'title 4 description', [
        argumentFactory.valueArgument('param1', 'param1 description', true, ['value1', 'value2']),
        argumentFactory.valueArgument('param2', 'param2 description', true, ['value3', 'value4']),
        argumentFactory.valueArgument('param3', 'param3 description', false, ['value5', 'value6']),
        argumentFactory.valueArgument('param4', 'param4 description', false),
      ]),
    ]
  
    const commandLineDirector = new CommandLineDirector('title', 'description', commandLines)
  
    let command = commandLineDirector.parseArguments([''], true)
    assert.equal(command, null);

    command = commandLineDirector.parseArguments(['value1'], true)
    assert.equal(command, null);

    command = commandLineDirector.parseArguments(['value1', 'value4'], true)
    assert.equal(command.values['param1'], 'value1');
    assert.equal(command.values['param2'], 'value4');

    command = commandLineDirector.parseArguments(['value1', 'value3', 'value6'], true)
    assert.equal(command.values['param1'], 'value1');
    assert.equal(command.values['param2'], 'value3');
    assert.equal(command.values['param3'], 'value6');

    command = commandLineDirector.parseArguments(['value1', 'value3', 'value6', '"http://url.test"'], true)
    assert.equal(command.values['param1'], 'value1');
    assert.equal(command.values['param2'], 'value3');
    assert.equal(command.values['param3'], 'value6');
    assert.equal(command.values['param4'], 'http://url.test');
  });  

  it('should generate a help text', () => {
    const commandLines = [
      new CommandLine('test1', 'title1', 'title 1 description', [
        argumentFactory.keyValueArgument('param1', 'param1 description', true, '--param1', '-p1'),
        argumentFactory.keyValueArgument('param2', 'param2 description', false, '--param2', '-p2', 'defaultParam2', ['defaultParam2', 'test']),
        argumentFactory.keyValueArgument('param3', 'param3 description', false, '--param3', '-p3', '100', null, new RegExp('^[0-9]*$')),
        argumentFactory.keyValueArgument('param4', 'param4 description', false, '--param4', '-p4')
      ]),
      new CommandLine('test2', 'title2', 'title 2 description', [
        argumentFactory.keyValueArgument('param1', 'param1 description', true, '--param1', '-p1'),
        argumentFactory.keyValueArgument('param2', 'param2 description', false, '--param2', '-p2', 200, [200, 201]),
        argumentFactory.keyValueArgument('param3', 'param3 description', false, '--param3', '-p3')
      ]),
      new CommandLine('test3', 'title3', 'title 3 description', [
        argumentFactory.flagArgument('param1', 'param1 description', '--param1', '-p1')
      ]),
      new CommandLine('test4', 'title4', 'title 4 description', [
        argumentFactory.valueArgument('param1', 'param1 description', true, ['value1', 'value2']),
        argumentFactory.valueArgument('param2', 'param2 description', true, ['value3', 'value4']),
        argumentFactory.valueArgument('param3', 'param3 description', false, ['value5', 'value6']),
        argumentFactory.valueArgument('param4', 'param4 description', false)
      ]),
    ]

    const commandLineDirector = new CommandLineDirector('title', 'description', commandLines)
    const helpText = commandLineDirector.generateHelp();

    assert.equal(helpText.includes('TITLE1'), true)
    assert.equal(helpText.includes('TITLE2'), true)
    assert.equal(helpText.includes('TITLE3'), true)
    assert.equal(helpText.includes('TITLE4'), true)
    assert.equal(helpText.includes('title 1 description'), true)
    assert.equal(helpText.includes('param1 descriptio'), true)
    assert.equal(helpText.includes(' R '), true)
    assert.equal(helpText.includes('--param1,-p1'), true)
  });

  it('should handle realworld example correct', () => {
    const commandLines = [
      new CommandLine('list-identifier', 'List', 'Create a list of items', [
        argumentFactory.valueArgument('command', 'command', true, ['list']),
        argumentFactory.flagArgument('delete', 'delete the list', '--delete', '-d'),
      ]),
      new CommandLine('open-identifier', 'Open', 'Open an item', [
        argumentFactory.valueArgument('command', 'command', true, ['open', 'display']),
        argumentFactory.flagArgument('all', 'Open all items', '--all', '-a'),
        argumentFactory.keyValueArgument('id', 'id to open', false, '--identifier', '-id'),
      ]),
      new CommandLine('update-identifier', 'Update', 'Updat an item', [
        argumentFactory.valueArgument('command', 'command', true, ['update']),
        argumentFactory.flagArgument('all', 'Open all items', '--all', '-a'),
        argumentFactory.keyValueArgument('id', 'id to open', false, '--identifier', '-id'),
      ]),
    ]
  
    const commandLineDirector = new CommandLineDirector('File cli', 'file cli description', commandLines)
    const helpText = commandLineDirector.generateHelp();

    let command = commandLineDirector.parseArguments(['list', '-d'], true)
    assert.equal(command.identifier, 'list-identifier');
    assert.equal(command.values['command'], 'list');
    assert.equal(command.values['delete'], true);

    command = commandLineDirector.parseArguments(['display', '--all', '--identifier=12'], true)
    assert.equal(command.identifier, 'open-identifier');
    assert.equal(command.values['command'], 'display');
    assert.equal(command.values['all'], true);
    assert.equal(command.values['id'], 12);

    command = commandLineDirector.parseArguments(['update', '-a', '-id=100'], true)
    assert.equal(command.identifier, 'update-identifier');
    assert.equal(command.values['command'], 'update');
    assert.equal(command.values['all'], true);
    assert.equal(command.values['id'], 100);
  });    
});
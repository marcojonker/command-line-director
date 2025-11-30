import { CommandLineArgument } from './command-line-argument';

export class Command {
  public identifier: string;
  public commandLineArguments: Array<CommandLineArgument>;
  public values: Map<string, any>;

  constructor (identifier: string, commandLineArguments: Array<CommandLineArgument>, values: Map<string, any>) {
    this.identifier = identifier
    this.commandLineArguments = commandLineArguments
    this.values = values
  }
}

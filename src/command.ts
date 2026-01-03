import { CommandLineArgument } from './command-line-argument';

export class Command {
  public identifier: string;
  public commandLineArguments: Array<CommandLineArgument<string | number | boolean>>;
  public values: Map<string, string | number | boolean | null>;

  constructor (identifier: string, commandLineArguments: Array<CommandLineArgument<string | number | boolean>>, values: Map<string, string | number | boolean | null>) {
    this.identifier = identifier
    this.commandLineArguments = commandLineArguments
    this.values = values
  }
}

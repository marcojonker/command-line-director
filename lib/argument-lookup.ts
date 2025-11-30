  export class ArgumentLookup {
    public values: string[];
    public keyValues: Map<string, any>;

    constructor() {
      this.values = [];
      this.keyValues = new Map<string, any>();
    }
  }
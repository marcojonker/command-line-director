  export class ArgumentLookup {
    public values: string[];
    public keyValues: Map<string, string | number | boolean | null>;

    constructor() {
      this.values = [];
      this.keyValues = new Map<string, string | number | boolean | null>();
    }
  }
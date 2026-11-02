"use strict";

import { execSync } from "child_process";

interface Input {
  branchName: string;
  issueTitle: string;
}

interface Output {
  status: string;
}

export default async function run(input: Input): Promise<Output> {
  try {
    // Commit changes
    execSync(`git add .`, { encoding: "utf-8" });
    execSync(`git commit -m "Implement feature: ${input.issueTitle}"`, {
      encoding: "utf-8",
    });
    execSync(`git push origin ${input.branchName}`, { encoding: "utf-8" });

    return { status: "success" };
  } catch (error) {
    console.error(`Error committing changes: ${error}`);
    throw error;
  }
}
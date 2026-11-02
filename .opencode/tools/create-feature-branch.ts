"use strict";

import { execSync } from "child_process";

interface Input {
  issueId: string;
  issueTitle: string;
}

interface Output {
  branchName: string;
}

export default async function run(input: Input): Promise<Output> {
  try {
    // Generate a short description from the issue title
    const shortDescription = input.issueTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    // Create the branch name
    const branchName = `feature/${input.issueId}_${shortDescription}`;

    // Create and checkout the branch
    execSync(`git checkout -b ${branchName}`, { encoding: "utf-8" });

    return { branchName };
  } catch (error) {
    console.error(`Error creating feature branch: ${error}`);
    throw error;
  }
}
"use strict";

import { execSync } from "child_process";

interface Input {
  branchName: string;
  issueId: string;
  issueTitle: string;
  issueBody: string;
}

interface Output {
  prUrl: string;
  status: string;
}

export default async function run(input: Input): Promise<Output> {
  try {
    // Generate a short description from the issue title
    const shortDescription = input.issueTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    // Create the PR title
    const prTitle = `feature/${input.issueId}_${shortDescription}`;

    // Create the PR body
    const prBody = `Closes #${input.issueId}

## Description
${input.issueBody}`;

    // Create the pull request
    const prUrl = execSync(
      `gh pr create --title "${prTitle}" --body "${prBody}" --base main --head ${input.branchName}`,
      { encoding: "utf-8" }
    ).trim();

    return { prUrl, status: "success" };
  } catch (error) {
    console.error(`Error creating pull request: ${error}`);
    throw error;
  }
}
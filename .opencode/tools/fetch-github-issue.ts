"use strict";

import { execSync } from "child_process";

interface Input {
  issueId: string;
}

interface Output {
  title: string;
  body: string;
  labels: string[];
}

export default async function run(input: Input): Promise<Output> {
  try {
    // Fetch issue details using the GitHub CLI
    const issueData = execSync(`gh issue view ${input.issueId} --json title,body,labels`, {
      encoding: "utf-8",
    });

    // Parse the JSON output
    const { title, body, labels } = JSON.parse(issueData);

    return {
      title,
      body,
      labels: labels.map((label: { name: string }) => label.name),
    };
  } catch (error) {
    console.error(`Error fetching GitHub issue: ${error}`);
    throw new Error(`Failed to fetch GitHub issue: ${error}`);
  }
}
"use strict";

import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

// --- Constants ---
const REPO_ROOT = process.cwd();
const BRANCH_PREFIX = "feature";
const COMMIT_MESSAGE_TEMPLATE = "Implement feature: {issue-title}";
const PR_TITLE_TEMPLATE = "feature/{issue-id}_{short-description}";
const PR_BODY_TEMPLATE = "Closes #{issue-id}\n\n## Description\n{issue-body}";

// --- Helper Functions ---
/**
 * Executes a shell command and returns the output as a string.
 * @param command - The command to execute.
 * @returns The command output as a string.
 */
function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    throw error;
  }
}

/**
 * Fetches GitHub issue details using the GitHub CLI.
 * @param issueId - The GitHub issue ID or URL.
 * @returns An object containing the issue title, body, and labels.
 */
function fetchIssueDetails(issueId: string): { title: string; body: string; labels: string[] } {
  const issueData = runCommand(`gh issue view ${issueId} --json title,body,labels`);
  const { title, body, labels } = JSON.parse(issueData);
  return { title, body, labels: labels.map((label: { name: string }) => label.name) };
}

/**
 * Generates a short description from the issue title.
 * @param title - The issue title.
 * @returns A short description (max 50 chars).
 */
function generateShortDescription(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
}

/**
 * Creates a feature branch name.
 * @param issueId - The GitHub issue ID.
 * @param shortDescription - The short description.
 * @returns The branch name in the format `feature/<issue-id>_<short-description>`.
 */
function createBranchName(issueId: string, shortDescription: string): string {
  return `${BRANCH_PREFIX}/${issueId}_${shortDescription}`;
}

/**
 * Implements the changes based on the issue description.
 * @param issueBody - The issue description.
 */
function implementChanges(issueBody: string): void {
  console.log("Analyzing issue description...")
  // TODO: Use AI to analyze the issue and implement changes.
  // For now, we'll simulate this by creating a placeholder file.
  const placeholderFilePath = join(REPO_ROOT, "src", "features", `feature-${Date.now()}.ts`);
  writeFileSync(placeholderFilePath, `// Placeholder for feature implementation based on issue description:\n// ${issueBody}`);
  console.log(`Created placeholder file: ${placeholderFilePath}`);
}

/**
 * Runs tests and linting.
 */
function runTestsAndLinting(): void {
  console.log("Running tests...")
  runCommand("npm test");

  console.log("Running linting...")
  runCommand("npm run lint");
}

/**
 * Commits changes to the feature branch.
 * @param branchName - The feature branch name.
 * @param issueTitle - The issue title.
 */
function commitChanges(branchName: string, issueTitle: string): void {
  runCommand(`git checkout -b ${branchName}`);
  runCommand(`git add .`);
  const commitMessage = COMMIT_MESSAGE_TEMPLATE.replace("{issue-title}", issueTitle);
  runCommand(`git commit -m "${commitMessage}"`);
  runCommand(`git push origin ${branchName}`);
}

/**
 * Creates a pull request.
 * @param branchName - The feature branch name.
 * @param issueId - The GitHub issue ID.
 * @param issueTitle - The issue title.
 * @param issueBody - The issue body.
 */
function createPullRequest(branchName: string, issueId: string, issueTitle: string, issueBody: string): void {
  const shortDescription = generateShortDescription(issueTitle);
  const prTitle = PR_TITLE_TEMPLATE.replace("{issue-id}", issueId).replace("{short-description}", shortDescription);
  const prBody = PR_BODY_TEMPLATE.replace("{issue-id}", issueId).replace("{issue-body}", issueBody);

  runCommand(`gh pr create --title "${prTitle}" --body "${prBody}" --base main --head ${branchName}`);
}

// --- Main Function ---
/**
 * Main function to automate the workflow.
 * @param issueId - The GitHub issue ID or URL.
 */
async function main(issueId: string): Promise<void> {
  try {
    console.log(`Starting coder agent for issue: ${issueId}`);

    // Step 1: Fetch issue details
    const { title, body } = fetchIssueDetails(issueId);
    console.log(`Fetched issue: ${title}`);

    // Step 2: Generate branch name
    const shortDescription = generateShortDescription(title);
    const branchName = createBranchName(issueId, shortDescription);
    console.log(`Created branch name: ${branchName}`);

    // Step 3: Implement changes
    implementChanges(body);

    // Step 4: Run tests and linting
    runTestsAndLinting();

    // Step 5: Commit changes
    commitChanges(branchName, title);

    // Step 6: Create PR
    createPullRequest(branchName, issueId, title, body);

    console.log("Coder agent workflow completed successfully!");
  } catch (error) {
    console.error("Error in coder agent workflow:", error);
    process.exit(1);
  }
}

// --- Run the Script ---
const issueId = process.argv[2];
if (!issueId) {
  console.error("Error: Please provide a GitHub issue ID or URL.");
  process.exit(1);
}

main(issueId);
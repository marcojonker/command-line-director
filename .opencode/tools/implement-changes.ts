"use strict";

import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

interface Input {
  issueBody: string;
  issueTitle: string;
}

interface Output {
  status: string;
  files: Array<{
    path: string;
    content: string;
  }>;
}

export default async function run(input: Input): Promise<Output> {
  try {
    // Use OpenCode's subagent to implement the changes
    const prompt = `
      You are an **experienced Node.js/TypeScript developer** tasked with implementing the following GitHub issue:

      ### Issue Title
      ${input.issueTitle}

      ### Issue Description
      ${input.issueBody}

      ### Instructions
      1. **Analyze the Issue**:
         - Read the issue description carefully.
         - Identify the **requirements**, **edge cases**, and **expected behavior**.

      2. **Plan the Changes**:
         - Break down the issue into **small, manageable tasks**.
         - Identify the **files** that need to be modified or created.

      3. **Implement the Changes**:
         - Follow **TypeScript and Node.js best practices**:
           - Use **strong typing** for all variables, functions, and return values.
           - Write **modular code** with clear separation of concerns.
           - Use **JSDoc comments** for public APIs.
           - Follow the **existing code style** in the repository.
         - Ensure the changes are **backward-compatible** unless explicitly stated in the issue.
         - Write **unit tests** for new functionality.

      4. **Output the Changes**:
         - Provide the **updated files** and their **contents** in JSON format.
         - Example:
           {
             "files": [
               {
                 "path": "src/features/new-feature.ts",
                 "content": "// Updated code here"
               }
             ]
           }
    `;

    // Call OpenCode's subagent to implement the changes
    const response = execSync(
      `opencode subagent general "Implement GitHub Issue" "${prompt}"`,
      { encoding: "utf-8" }
    );

    // Parse the subagent's response
    const { files } = JSON.parse(response);

    // Apply the changes to the codebase
    files.forEach((file: { path: string; content: string }) => {
      const dir = join(process.cwd(), file.path, "..");
      mkdirSync(dir, { recursive: true });
      writeFileSync(file.path, file.content);
      console.log(`Updated file: ${file.path}`);
    });

    return { status: "success", files };
  } catch (error) {
    console.error(`Error implementing changes: ${error}`);
    throw new Error(`Failed to implement changes: ${error}`);
  }
}
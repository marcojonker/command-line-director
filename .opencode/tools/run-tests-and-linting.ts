"use strict";

import { execSync } from "child_process";

interface Output {
  status: string;
}

export default async function run(): Promise<Output> {
  try {
    // Run tests
    console.log("Running tests...");
    execSync("npm test", { encoding: "utf-8", stdio: "inherit" });

    // Run linting
    console.log("Running linting...");
    execSync("npm run lint", { encoding: "utf-8", stdio: "inherit" });

    return { status: "success" };
  } catch (error) {
    console.error(`Error running tests or linting: ${error}`);
    throw error;
  }
}
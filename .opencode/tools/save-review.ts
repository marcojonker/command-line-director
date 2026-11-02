import { tool } from "@opencode-ai/plugin"
import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const FindingSchema = tool.schema.object({
  severity: tool.schema.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  path: tool.schema.string(),
  line: tool.schema.number(),
  start_line: tool.schema.number(),
  category: tool.schema.enum([
    "Bug",
    "Security",
    "Performance",
    "Maintainability",
  ]),
  confidence: tool.schema.enum(["High", "Medium", "Low"]),
  title: tool.schema.string(),
  body_lines: tool.schema.array(tool.schema.string()),
}).strict()

const ReviewSchema = tool.schema.object({
  summary: tool.schema.string(),
  compliment: tool.schema.string(),
  joke: tool.schema.string(),
  verdict: tool.schema.enum(["APPROVE", "REQUEST_CHANGES"]),
  findings: tool.schema.array(FindingSchema),
}).strict()

interface Context {
  worktree: string
}

const severityOrder: Record<typeof FindingSchema._type.severity, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
}

export default tool({
  description:
    "Validate, serialize and save the completed pull request review as strict JSON to .review/findings.json. This is the only permitted review output writer.",

  args: {
    review: ReviewSchema.describe(
      "The complete structured pull request review."
    ),
  },

  async execute(args: { review: typeof ReviewSchema._type }, context: Context) {
    // Validate the complete object against the strict schema.
    const review = ReviewSchema.parse(args.review)

    if (!context.worktree) {
      throw new Error("OpenCode did not provide a worktree directory.")
    }

    // Validate fields that require cross-field or custom checks.
    for (const [index, finding] of review.findings.entries()) {
      if (
        !Number.isSafeInteger(finding.line) ||
        finding.line < 1 ||
        !Number.isSafeInteger(finding.start_line) ||
        finding.start_line < 1 ||
        finding.start_line > finding.line
      ) {
        throw new Error(
          `Finding ${index + 1} has invalid line/start_line values.`
        )
      }

      if (
        finding.path.length === 0 ||
        finding.path.startsWith("/") ||
        /^[A-Za-z]:[\\/]/.test(finding.path) ||
        finding.path.split(/[\\/]/).includes("..")
      ) {
        throw new Error(
          `Finding ${index + 1} has an unsafe repository-relative path.`
        )
      }

      if (!finding.title.trim()) {
        throw new Error(`Finding ${index + 1} has an empty title.`)
      }

      if (
        finding.body_lines.length === 0 ||
        finding.body_lines.some(
          (line: string) => line.includes("\n") || line.includes("\r")
        )
      ) {
        throw new Error(
          `Finding ${index + 1} has invalid body_lines. Each element must be one line.`
        )
      }
    }

    // The verdict is deterministic: CRITICAL/HIGH requires changes.
    const requiresChanges = review.findings.some(
      (finding: typeof FindingSchema._type) =>
        finding.severity === "CRITICAL" ||
        finding.severity === "HIGH"
    )

    const expectedVerdict = requiresChanges
      ? "REQUEST_CHANGES"
      : "APPROVE"

    if (review.verdict !== expectedVerdict) {
      throw new Error(
        `Incorrect verdict: expected ${expectedVerdict}, received ${review.verdict}.`
      )
    }

    // Sort findings consistently before serialization.
    const normalizedReview = {
      ...review,
      findings: [...review.findings].sort(
        (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
      ),
    }

    // The output path is fixed; callers cannot select another file.
    const outputDirectory = resolve(context.worktree, ".review")
    const outputFile = resolve(outputDirectory, "findings.json")

    await mkdir(outputDirectory, { recursive: true })

    // JSON.stringify handles quotes, backslashes and control characters.
    const serialized = JSON.stringify(normalizedReview, null, 2) + "\n"

    // Parse and validate the serialized representation before writing.
    const roundTripped = ReviewSchema.parse(JSON.parse(serialized))

    if (roundTripped.findings.length !== normalizedReview.findings.length) {
      throw new Error("Serialized review failed round-trip validation.")
    }

    await writeFile(outputFile, serialized, {
      encoding: "utf8",
      flag: "w",
    })

    return [
      "Review JSON successfully serialized, validated and saved.",
      `File: ${outputFile}`,
      `Findings: ${roundTripped.findings.length}`,
      `Verdict: ${roundTripped.verdict}`,
      "Schema validation: passed",
      "JSON round-trip validation: passed",
    ].join("\n")
  },
})

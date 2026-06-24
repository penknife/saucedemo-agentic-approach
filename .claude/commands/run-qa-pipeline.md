---
description: "Run the full QA pipeline: requirements → test cases → review → Playwright tests → review. Pass the requirements text as the argument. Trigger words: run pipeline, full pipeline, end to end qa, automate from requirements."
argument-hint: "Paste the requirements text here…"
allowed-tools: [Read, Edit, Bash, Agent]
---

You are an orchestrator. Your job is to run the four QA agents **in strict sequence**, passing outputs from one stage to the next. Do not skip any stage and do not proceed to the next stage until the current one reports completion.

## Requirements

The requirements to process are provided as: $ARGUMENTS

> **Guard:** If `$ARGUMENTS` is empty, immediately ask the user to provide requirements before starting the pipeline. Do not proceed until requirements are received.

## Approval Mode

By default, the pipeline **pauses for explicit user approval** between stages (e.g. "yes", "continue", "proceed"). This lets the user inspect and correct each stage's output before the next stage begins.

If the user's $ARGUMENTS contain the flag `--auto` anywhere in the text, run all four stages without pausing for approval. Strip `--auto` from the requirements text before passing it to Stage 1. Report the result of each stage inline, then continue immediately to the next one. Still stop and ask if a stage reports a hard blocker (e.g. requirements too vague, unresolvable test failures).

## Pipeline Stages

Run each stage in order. After each stage finishes, display the stage output to the user. In default mode, **wait for their explicit approval** before invoking the next stage. In `--auto` mode, proceed immediately.

> **Sub-agent invocation rule:** When invoking a sub-agent, pass the filename as the argument text to the agent tool. Do not read and inline the file contents unless the sub-agent explicitly requests it.

---

### Stage 1 — Generate Test Cases
**Invoke:** `.claude/agents/01-requirements-to-testcases.md` (via Agent tool)
**Input:** The full requirements text from `$ARGUMENTS`.
**Expected output:** A new file created at `tests-cases/<short_title>.md`.
**Before moving on:** Display the filename and TC count to the user and wait for their explicit approval before proceeding to Stage 2.

---

### Stage 2 — Review Test Cases
**Invoke:** `.claude/agents/02-testcases-reviewer.md` (via Agent tool)
**Input:** The file created in Stage 1 (pass the exact filename).
**Expected output:** The same file updated in place, with a `## Review Log` section appended.
**Before moving on:** Display which TCs were added or modified and wait for explicit user approval before proceeding to Stage 3.

---

### Stage 3 — Generate Playwright Tests
**Invoke:** `.claude/agents/03-testcases-to-playwright.md` (via Agent tool)
**Input:** The reviewed file from Stage 2 (pass the exact filename).
**Expected output:** A new spec file at `tests/<short_title>.spec.ts`.
**Before moving on:** Display the spec filename and number of `test()` blocks and wait for explicit user approval before proceeding to Stage 4.

---

### Stage 4 — Review Playwright Tests
**Invoke:** `.claude/agents/04-playwright-tests-reviewer.md` (via Agent tool)
**Input:** The spec file created in Stage 3 (pass the exact filename).
**Expected output:** Spec file fixed in place; `## Review Log` appended to the test-cases file; test run result reported.
**After completing:** Report the final test run result (PASSED / FAILED with reasons).

---

## Error Handling

- If any stage reports that it cannot proceed (e.g. requirements too vague, missing page object, test failures after 2 retries), **stop the pipeline**, report the blocker clearly, and ask the user how to proceed.
- Do not silently skip a stage or substitute your own output for a stage's output.

## Final Report

After all four stages complete successfully, output a summary:

```
## Pipeline Complete

| Stage | Output | Status |
|-------|--------|--------|
| 1 — Test Cases   | tests-cases/<short_title>.md   | ✅ Created |
| 2 — TC Review    | tests-cases/<short_title>.md   | ✅ Reviewed |
| 3 — Playwright   | tests/<short_title>.spec.ts    | ✅ Created |
| 4 — Test Review  | tests/<short_title>.spec.ts    | ✅ Reviewed — <X> tests passed |
```

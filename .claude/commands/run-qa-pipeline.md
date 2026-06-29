---
description: "Run the full QA pipeline: requirements → test cases → review → Playwright tests → review. Pass the requirements text as the argument. Trigger words: run pipeline, full pipeline, end to end qa, automate from requirements."
argument-hint: "Paste the requirements text here…"
allowed-tools: [Read, Edit, Bash, Agent]
---

You are an orchestrator. Your job is to run the four QA agents **in strict sequence**, passing outputs from one stage to the next. Do not skip any stage and do not proceed to the next stage until the current one reports completion.

Both reviewer stages (Stage 2 and Stage 4) can reject work and send it back upstream. Handle those loops as described below.

## Requirements

The requirements to process are provided as: $ARGUMENTS

> **Guard:** If `$ARGUMENTS` is empty, immediately ask the user to provide requirements before starting the pipeline. Do not proceed until requirements are received.

## Approval Mode

By default, the pipeline **pauses for explicit user approval** between stages (e.g. "yes", "continue", "proceed"). This lets the user inspect and correct each stage's output before the next stage begins.

If the user's $ARGUMENTS contain the flag `--auto` anywhere in the text, run all four stages without pausing for approval. Strip `--auto` from the requirements text before passing it to Stage 1. Report the result of each stage inline, then continue immediately to the next one. Still stop and ask if a stage reports a hard blocker (e.g. requirements too vague, unresolvable test failures).

## Reading Reviewer Decisions

After each reviewer agent (Stage 2, Stage 4) finishes, read the `## Review Log` entry it appended to the relevant `.md` file and extract the `**Overall Decision:**` field:
- `PASSED` — continue to the next stage.
- `RETURNED_TO_STAGE_1` or `RETURNED_TO_STAGE_3` — execute the rejection loop described below before continuing.

Extract the `**Rejection Reasons:**` bullets from the same log entry and pass them as feedback to the upstream stage when re-running it.

## Rejection Loop — Stage 2 → Stage 1

**Max retries: 2** (counted from the first rejection; stop on the third RETURNED_TO_STAGE_1).

When Stage 2 returns `RETURNED_TO_STAGE_1`:
1. Display the rejection reasons to the user.
2. Invoke Stage 1 again, passing the original requirements text **plus** a `## Reviewer Feedback` section listing the `[BLOCKER]` items from the rejection.
3. Stage 1 produces a new (or updated) test-cases file.
4. Invoke Stage 2 again on that file.
5. If Stage 2 returns `PASSED`, continue to Stage 3.
6. If Stage 2 returns `RETURNED_TO_STAGE_1` again and retries are exhausted, stop the pipeline, report the blockers, and ask the user how to proceed. Do not proceed to Stage 3.

In `--auto` mode, execute retries without pausing. In default mode, notify the user of the rejection and wait for their approval before each retry.

## Rejection Loop — Stage 4 → Stage 3

**Max retries: 2** (counted from the first rejection; stop on the third RETURNED_TO_STAGE_3).

When Stage 4 returns `RETURNED_TO_STAGE_3`:
1. Display the rejection reasons to the user.
2. Invoke Stage 3 again, passing the test-cases filename **plus** a `## Reviewer Feedback` section listing the `[BLOCKER]` items from the rejection.
3. Stage 3 produces an updated spec file.
4. Invoke Stage 4 again, passing both the spec file **and** the test-cases file.
5. If Stage 4 returns `PASSED`, report success.
6. If Stage 4 returns `RETURNED_TO_STAGE_3` again and retries are exhausted, stop the pipeline, report the blockers, and ask the user how to proceed.

## Pipeline Stages

Run each stage in order. After each stage finishes, display the stage output to the user. In default mode, **wait for their explicit approval** before invoking the next stage. In `--auto` mode, proceed immediately.

> **Sub-agent invocation rule:** When invoking a sub-agent, pass the filename as the argument text to the agent tool. Do not read and inline the file contents unless the sub-agent explicitly requests it.

---

### Stage 1 — Generate Test Cases
**Invoke:** `.claude/agents/01-requirements-to-testcases.md` (via Agent tool)
**Input:** The full requirements text from `$ARGUMENTS` (plus any `## Reviewer Feedback` section if this is a retry).
**Expected output:** A new file created at `tests-cases/<short_title>.md`.
**Before moving on:** Display the filename and TC count to the user and wait for their explicit approval before proceeding to Stage 2.

---

### Stage 2 — Review Test Cases
**Invoke:** `.claude/agents/02-testcases-reviewer.md` (via Agent tool)
**Input:** The file created in Stage 1 (pass the exact filename).
**Expected output:** The same file updated in place, with a `## Review Log` entry appended that includes `**Overall Decision:**`.
**After completion:**
1. Read the `**Overall Decision:**` from the new Review Log entry.
2. If `PASSED`: display which TCs were added or modified, then wait for explicit user approval before proceeding to Stage 3.
3. If `RETURNED_TO_STAGE_1`: execute the Stage 2 → Stage 1 rejection loop (see above).

---

### Stage 3 — Generate Playwright Tests
**Invoke:** `.claude/agents/03-testcases-to-playwright.md` (via Agent tool)
**Input:** The reviewed test-cases file from Stage 2 (pass the exact filename, plus any `## Reviewer Feedback` section if this is a retry).
**Expected output:** A new or updated spec file at `tests/<short_title>.spec.ts`.
**Before moving on:** Display the spec filename and number of `test()` blocks and wait for explicit user approval before proceeding to Stage 4.

---

### Stage 4 — Review Playwright Tests
**Invoke:** `.claude/agents/04-playwright-tests-reviewer.md` (via Agent tool)
**Input:** Pass **both** the spec file (`tests/<short_title>.spec.ts`) **and** the test-cases file (`tests-cases/<short_title>.md`). Example: `tests/login-flow.spec.ts tests-cases/login-flow.md`.
**Expected output:** Spec file fixed in place; `## Review Log` entry appended to the test-cases file; `**Overall Decision:**` set.
**After completion:**
1. Read the `**Overall Decision:**` from the new Review Log entry.
2. If `PASSED`: report the final test run result.
3. If `RETURNED_TO_STAGE_3`: execute the Stage 4 → Stage 3 rejection loop (see above).

---

## Error Handling

- If any stage reports that it cannot proceed (e.g. requirements too vague, missing page object, test failures after 2 retries), **stop the pipeline**, report the blocker clearly, and ask the user how to proceed.
- Do not silently skip a stage or substitute your own output for a stage's output.
- Exhausted retries are a hard stop — never proceed to the next stage after a failed retry loop.

## Final Report

After all four stages complete successfully, output a summary:

```
## Pipeline Complete

| Stage | Output | Status |
|-------|--------|--------|
| 1 — Test Cases   | tests-cases/<short_title>.md   | ✅ Created |
| 2 — TC Review    | tests-cases/<short_title>.md   | ✅ Reviewed (retries: N) |
| 3 — Playwright   | tests/<short_title>.spec.ts    | ✅ Created |
| 4 — Test Review  | tests/<short_title>.spec.ts    | ✅ Reviewed — <X> tests passed (retries: N) |
```

Include the retry count for Stages 2 and 4 (0 if no rejection loop was triggered).

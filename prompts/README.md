# Agent Prompts

This directory contains versioned prompt files for the L.E. onboarding agent.

## Current Configuration (Combined Two-Phase Flow)

This project runs a **two-phase onboarding** where users interact with both variants sequentially:

| Phase | Variant | Prompt File | Version Tag | Display Label |
|-------|---------|-------------|-------------|---------------|
| 1 | Supportive Coach | `onboarding_agent_prompt_02-16-com-supp.md` | `02-16-com-supp` | Var. A Supp. 02-16-01 |
| 2 | Exploratory Guide | `onboarding_agent_prompt_02-16-com-expl.md` | `02-16-com-expl` | Var. B Expl. 02-16-01 |

Both prompts are embedded in [`../app/page.js`](../app/page.js) within the `PHASES` array.

## How to Update the Active Prompts

1. **Create/Edit Prompt**: Modify an existing prompt file or create a new versioned file

2. **Update Application**: Update the corresponding entry in the `PHASES` array in [`../app/page.js`](../app/page.js)

3. **Update Version Constants** (REQUIRED for each phase):
   - Update `promptVersion` — used for transcript tagging
   - Update `displayLabel` — shown on UI below buttons
   - These must always be updated together when a prompt changes

4. **Format for JavaScript**:
   - Remove markdown headers (# symbols)
   - Ensure proper line breaks are preserved
   - Escape any backticks or special characters if needed
   - Keep template variables like `{{relevant_domain}}`

5. **Test**: Run the application locally and verify both phases work correctly

6. **Document**: Update this README with version notes if creating new prompt files

## Prompt Structure

All prompts follow this structure:

1. **Role**: Defines who the agent is (L.E.)
2. **Core Objective**: States the mission and desired outcomes
3. **Global Rules**: Conversational constraints and boundaries
4. **Tone & Style**: Personality and energy guidelines
5. **Move-Based Execution**: Five sequential conversational moves
   - Move 1: Orientation & Framing
   - Move 2: Motivation & Context
   - Move 3: Skills & Experience
   - Move 4: Learning Rhythm
   - Move 5: Integration & Forward Momentum
6. **Meta-Awareness**: AI disclosure requirements
7. **End State**: Success criteria

## Prompt Design Principles

When creating or modifying prompts:

- **One question at a time**: Maintain conversational flow
- **Brevity**: Keep responses under ~75 words
- **Flexibility**: Allow learners to skip or revisit answers
- **Non-evaluative**: No testing, labeling, or judging
- **Transparency**: Clear about purpose and use of information
- **Learner agency**: Emphasize control and revisability
- **Contextual awareness**: Acknowledge volunteered information to avoid re-asking

## Version Naming Convention

For combined-flow prompts, use the `com-` prefix:

Format: `onboarding_agent_prompt_MM-DD-com-VARIANT.md`

- `MM-DD`: Month and day of creation
- `com`: Indicates combined/comparative flow
- `VARIANT`: `supp` for supportive, `expl` for exploratory

Examples:
- `onboarding_agent_prompt_02-16-com-supp.md` — Supportive variant for combined flow
- `onboarding_agent_prompt_02-16-com-expl.md` — Exploratory variant for combined flow

## Testing New Prompts

Before deploying new prompts:

1. Test the full two-phase flow end-to-end
2. Verify both phases save transcripts with correct version tags
3. Check that both transcripts share the same session ID
4. Ensure the transition screen appears between phases
5. Verify the agent asks one question at a time in each phase
6. Check that template variables are appropriately filled

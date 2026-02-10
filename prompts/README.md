# Agent Prompts

This directory contains versioned prompt files for the L.E. onboarding agent.

## Current Version

**Active Prompt**: `onboarding_agent_prompt_02-10_a.md` (February 10, 2026)

This prompt is currently deployed in [`app/page.js`](../app/page.js) as the `SYSTEM_PROMPT` constant.

## Prompt Versions

### `onboarding_agent_prompt_02-10_a.md` (Current)
**Date**: February 10, 2026
**Key Features**:
- Welcomes learner with motivating frame
- Asks for learner's name after consent (Move 1)
- Includes explicit four-option career goal question (Move 2):
  - Advancing where you are
  - Exploring or transitioning to something new
  - Preparing to re-enter the workforce
  - Stabilizing and deepening where you already are
- Enhanced emphasis on learner agency and flexibility
- Instruction to display "Continue" button at end

### `onboarding_agent_prompt_02-09_a.md` (Previous)
**Date**: February 9, 2026
**Key Features**:
- Original five-move structure
- No explicit name collection
- Open-ended career questions without structured options
- Similar flow but less structured

## How to Update the Active Prompt

1. **Create/Edit Prompt**: Modify an existing prompt file or create a new versioned file (e.g., `onboarding_agent_prompt_02-11_a.md`)

2. **Update Application**: Copy the prompt content to the `SYSTEM_PROMPT` constant in [`../app/page.js`](../app/page.js) (lines 6-138)

3. **Format for JavaScript**:
   - Remove markdown headers (# symbols)
   - Ensure proper line breaks are preserved
   - Escape any backticks or special characters if needed
   - Keep template variables like `{{relevant_domain}}`

4. **Test**: Run the application locally and verify the agent behaves as expected

5. **Document**: Update this README with version notes if creating a new prompt file

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

## Testing New Prompts

Before deploying a new prompt:

1. Test the full five-move conversation flow
2. Verify the agent asks one question at a time
3. Ensure the agent responds appropriately to:
   - Brief answers
   - Detailed answers
   - Uncertain answers
   - Mixed motivations
4. Check that completion message triggers the end state
5. Verify template variables are appropriately filled

## Version Naming Convention

Format: `onboarding_agent_prompt_MM-DD_X.md`

- `MM-DD`: Month and day of creation
- `X`: Variant letter (a, b, c) if multiple versions on same day

Examples:
- `onboarding_agent_prompt_02-10_a.md` - First version on Feb 10
- `onboarding_agent_prompt_02-10_b.md` - Second version on Feb 10
- `onboarding_agent_prompt_03-15_a.md` - First version on Mar 15

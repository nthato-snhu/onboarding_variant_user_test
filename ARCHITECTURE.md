# Architecture Documentation

## System Overview

This document provides detailed technical information about the AI Fundamentals Onboarding Agent architecture, implementation patterns, and key components.

## Application Flow

```
User visits site
    ↓
Intro screen (Start Onboarding button)
    ↓
Agent initialization (sends "Begin onboarding" to API)
    ↓
Conversational loop:
    - User inputs message
    - Message history sent to /api/chat
    - LLM processes with system prompt
    - Agent response displayed
    - History updated
    ↓
Completion detected (regex pattern match)
    ↓
"Finish Onboarding" button displayed
    ↓
Session data logged to console
```

## Component Architecture

### Frontend: `/app/page.js`

**State Management**
```javascript
- messages: Array of conversation messages with timestamps
- currentInput: Text input field state
- isTyping: Boolean for loading indicator
- isComplete: Boolean for completion state
- showIntro: Boolean for intro screen visibility
- started: Boolean for conversation initiation
- sessionData: Object containing startTime and conversationHistory
```

**Key Functions**

1. **`handleStartOnboarding()`**
   - Transitions from intro screen to chat interface
   - Initializes session timestamp
   - Triggers first agent message

2. **`callAPI(conversationHistory)`**
   - Makes POST request to `/api/chat`
   - Sends conversation history and system prompt
   - Returns agent's response text
   - Handles errors with fallback message

3. **`handleSubmit()`**
   - Validates input and state
   - Adds user message to conversation
   - Updates conversation history
   - Calls API with updated history
   - Checks for completion pattern
   - Updates session data

4. **`addMessage(sender, text)`**
   - Appends message to messages array
   - Adds timestamp for logging

**Completion Detection**
Located at lines 234-236, uses regex to detect when the agent signals completion:
```javascript
if (/(?:ready to move on|let's get started|let's dive in|ready when you are)(?:\!|\?|\.)/i.test(agentResponse) &&
    /next, I'll show you how you'll be growing/i.test(agentResponse))
```
**Note**: This pattern may need updating if the prompt's final message changes.

### Backend: `/app/api/chat/route.js`

**Provider Detection**
```javascript
getProvider() determines LLM provider based on LLM_MODEL env var:
- "azure_openai:deployment" → Azure OpenAI
- "anthropic:model" → Anthropic
- Default → OpenAI
```

**Provider-Specific Implementations**

1. **OpenAI (`callOpenAI`)**
   - Endpoint: `https://api.openai.com/v1/chat/completions`
   - Auth: Bearer token via `OPENAI_API_KEY`
   - Message format: Standard OpenAI chat format with system message

2. **Azure OpenAI (`callAzureOpenAI`)**
   - Endpoint: Constructed from `AZURE_OPENAI_ENDPOINT` + deployment name
   - Auth: API key header
   - API version: Configurable via `OPENAI_API_VERSION`
   - Message format: Same as OpenAI

3. **Anthropic (`callAnthropic`)**
   - Endpoint: `https://api.anthropic.com/v1/messages`
   - Auth: `x-api-key` header via `ANTHROPIC_API_KEY`
   - Message format: Separate system parameter (not in messages array)
   - API version: `2023-06-01`

**Request Parameters**
All providers use:
- `max_tokens: 1000` - Response length limit
- System prompt from frontend
- Conversation history

## Agent Prompt Structure

The system prompt in [`app/page.js`](app/page.js) lines 6-138 follows this structure:

### Sections

1. **Role Definition**
   - Identifies the agent as "L.E."
   - States the mission (personalization through purposeful questions)
   - Establishes non-evaluative stance

2. **Core Objective**
   - Trust building
   - Information gathering
   - Transparency about personalization

3. **Global Rules**
   - Conversational constraints (one question at a time, ~75 words)
   - Response logic (acknowledge volunteered info, don't re-ask)
   - Behavioral boundaries (no teaching yet, no diagnostic framing)

4. **Tone & Style Guidelines**
   - Emotional calibration (warm, calm, adult)
   - Energy matching
   - Conversational approach

5. **Move-Based Execution (The Five Moves)**
   - Each move has: Goal, Do (instructions), Ask/Say (specific questions/responses)
   - Sequential structure with flexibility

6. **Meta-Awareness**
   - AI disclosure requirement
   - Partnership framing

7. **End State**
   - Success criteria for completion

### Template Variables
The prompt includes placeholders that the LLM contextually fills:
- `{{relevant_domain}}` - Learner's area of experience
- `{{session_style}}` - Preferred learning session format
- `{{time_estimate}}` - Weekly time commitment

## Data Flow

### Message Flow Diagram

```
Frontend                    API Route                   LLM Provider
   |                           |                            |
   |----POST /api/chat-------->|                            |
   |  {messages, systemPrompt} |                            |
   |                           |----API Request------------>|
   |                           |  (with system + history)   |
   |                           |                            |
   |                           |<---Response----------------|
   |                           |  {text: "..."}             |
   |<--JSON Response-----------|                            |
   |  {text: "..."}            |                            |
   |                           |                            |
```

### Conversation History Format

**Frontend Storage**:
```javascript
conversationHistory: [
  { role: 'user', content: 'User message text' },
  { role: 'assistant', content: 'Agent response text' },
  ...
]
```

**Display Messages**:
```javascript
messages: [
  { sender: 'user', text: '...', timestamp: '2024-02-10T...' },
  { sender: 'agent', text: '...', timestamp: '2024-02-10T...' },
  ...
]
```

These are maintained separately because:
- `conversationHistory` matches LLM API format
- `messages` includes UI-specific metadata (timestamps, sender labels)

## UI/UX Implementation

### Design System

**Color Palette**:
- Primary: Purple (`purple-600`, `purple-500`, `purple-400`)
- Background: Black and dark grays (`gray-900`, `gray-800`)
- Text: Light grays (`gray-200`, `gray-300`, `gray-400`)
- Borders: Dark grays with transparency

**Key UI States**:
1. **Intro Screen** (`showIntro: true`)
   - Centered card with program information
   - Instructions for test participants
   - "Start Onboarding" CTA button

2. **Active Conversation** (`started: true, !isComplete`)
   - Message thread with scrolling
   - Agent messages (left, purple background)
   - User messages (right, gray background)
   - Input field with send button
   - Typing indicator (animated dots)

3. **Completion State** (`isComplete: true`)
   - Input disabled
   - "Finish Onboarding" button replaces input
   - Completion badge displayed

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Flexible text sizes (`text-sm sm:text-base`)
- Adaptive padding (`p-3 sm:p-4`)
- Maximum message widths prevent overflow

## Configuration Options

### Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `LLM_MODEL` | No | `gpt-4o` | Specifies provider and model |
| `OPENAI_API_KEY` | If using OpenAI | - | OpenAI authentication |
| `AZURE_OPENAI_ENDPOINT` | If using Azure | - | Azure resource URL |
| `AZURE_OPENAI_API_KEY` | If using Azure | - | Azure authentication |
| `OPENAI_API_VERSION` | No | `2024-12-01-preview` | Azure API version |
| `ANTHROPIC_API_KEY` | If using Anthropic | - | Anthropic authentication |

### Model Selection Examples

**GPT-4 Turbo**:
```bash
LLM_MODEL=gpt-4-turbo-preview
```

**GPT-3.5 Turbo**:
```bash
LLM_MODEL=gpt-3.5-turbo
```

**Claude 3.5 Sonnet**:
```bash
LLM_MODEL=anthropic:claude-3-5-sonnet-20241022
```

**Azure Deployment**:
```bash
LLM_MODEL=azure_openai:my-gpt4-deployment
```

## Error Handling

### Frontend Error Handling
- API call failures display user-friendly fallback message
- Input validation prevents empty submissions
- State guards prevent actions during loading or after completion

### Backend Error Handling
- All provider functions catch and log detailed errors
- HTTP errors are logged with full error response
- Generic 500 response sent to frontend on failure
- No sensitive error details exposed to client

## Performance Considerations

### Optimization Strategies
1. **Client-side state management**: No external state library needed for simple conversation flow
2. **Minimal re-renders**: State updates are batched appropriately
3. **Auto-scrolling**: Messages scroll into view on new content
4. **Disabled states**: Prevent duplicate submissions during processing

### Potential Improvements
- Add request debouncing for rapid submissions
- Implement message streaming for faster perceived response time
- Add local storage persistence for page refreshes
- Consider caching provider responses for identical inputs

## Testing Considerations

### Frontend Testing Scenarios
1. Intro screen displays correctly
2. Conversation initiates on button click
3. Messages appear in correct order
4. User input is properly validated
5. Completion state is detected
6. Session data is logged correctly

### Backend Testing Scenarios
1. Provider detection works for all formats
2. Each provider returns valid responses
3. Error handling works for failed API calls
4. Message history is properly formatted
5. System prompt is included in requests

### Integration Testing
1. End-to-end conversation flow
2. Completion detection with various agent responses
3. Session data accuracy
4. Provider switching without code changes

## Security Notes

### API Key Protection
- All keys stored in `.env.local` (not committed to repo)
- Backend-only API calls (keys never exposed to client)
- Vercel environment variables for deployment

### Input Validation
- User input is not executed or evaluated
- Messages are treated as plain text
- No XSS vulnerabilities in message rendering (React escapes by default)

### Rate Limiting Considerations
- No built-in rate limiting (rely on provider limits)
- Consider adding if abuse is observed
- Vercel serverless functions have execution time limits

## Future Enhancement Ideas

1. **Conversation branching**: Allow agent to ask follow-up questions based on responses
2. **Session persistence**: Save progress and allow resuming later
3. **Analytics integration**: Track common patterns, completion rates
4. **A/B testing framework**: Compare different prompt variations
5. **Multi-language support**: Internationalization for prompts and UI
6. **Voice input**: Add speech-to-text for accessibility
7. **Admin dashboard**: View aggregated session data
8. **Prompt versioning UI**: Select/compare different prompt versions without code changes

## Troubleshooting Guide

### "API error: 401"
- **Cause**: Invalid or missing API key
- **Fix**: Verify key is set correctly in `.env.local`

### "API error: 429"
- **Cause**: Rate limit exceeded
- **Fix**: Wait before retrying; consider upgrading API plan

### "API error: 500"
- **Cause**: Provider service issue or malformed request
- **Fix**: Check provider status page; verify message format

### Agent not responding appropriately
- **Cause**: System prompt not aligned with desired behavior
- **Fix**: Review and update `SYSTEM_PROMPT` in [`app/page.js`](app/page.js)

### Completion not detected
- **Cause**: Agent's final message doesn't match regex pattern
- **Fix**: Update completion detection pattern at lines 234-236

### Messages not displaying
- **Cause**: State update issue or rendering problem
- **Fix**: Check browser console for React errors

## Maintenance Checklist

**Regular Tasks**:
- [ ] Review and update prompt versions in `/prompts/`
- [ ] Sync `SYSTEM_PROMPT` constant with latest prompt file
- [ ] Test with different LLM providers periodically
- [ ] Review session data logs for conversation quality
- [ ] Update dependencies (Next.js, React, Tailwind)

**When Updating the Prompt**:
- [ ] Create new versioned file in `/prompts/`
- [ ] Update `SYSTEM_PROMPT` in `app/page.js`
- [ ] Test full conversation flow
- [ ] Verify completion detection still works
- [ ] Document changes in commit message

**When Changing Providers**:
- [ ] Update `LLM_MODEL` environment variable
- [ ] Add required API keys
- [ ] Test API route with new provider
- [ ] Verify response format compatibility
- [ ] Monitor response quality and timing

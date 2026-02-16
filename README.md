# AI Fundamentals Onboarding Agent

**Last updated:** February 16, 2026

A Next.js application featuring an AI-powered onboarding agent (L.E.) that personalizes the learning experience for AI Fundamentals students through a conversational interface.

## Project Overview

### Purpose
This application provides an intelligent onboarding experience that:
- Gathers learner information through natural conversation
- Personalizes learning paths based on individual needs
- Builds trust and establishes learner agency
- Creates a smooth transition into the learning program

### Agent Behavior Summary
**L.E.** (the onboarding agent) follows a structured five-move conversation flow:

1. **Orientation & Framing**: Welcomes learners, explains the purpose of questions, asks for their name, and establishes trust
2. **Motivation & Context**: Discovers why they're here and their career goals (advancing, transitioning, re-entering, or stabilizing)
3. **Skills & Experience**: Calibrates starting point based on existing skills, domains, and learning comfort
4. **Learning Rhythm**: Adapts pacing to their real availability (time of day, session length, weekly commitment)
5. **Integration & Forward Momentum**: Synthesizes inputs and explicitly shows how the experience has been personalized

The agent is designed to be:
- Warm, calm, and conversational
- Transparent about its AI nature
- Respectful of learner agency
- Focused on gathering only essential information
- Flexible and non-evaluative

## Architecture

### Tech Stack
- **Framework**: Next.js 15.1.4 with App Router
- **UI**: React 19 with Tailwind CSS
- **Icons**: Lucide React
- **LLM Support**: Multi-provider (OpenAI, Azure OpenAI, Anthropic)

### Project Structure

```
onboarding_user_test/
├── app/
│   ├── admin/
│   │   └── transcripts/
│   │       └── page.js           # Admin interface for browsing transcripts
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.js          # API endpoint for LLM calls
│   │   └── transcripts/
│   │       └── route.js          # API endpoint for saving/retrieving transcripts
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Main onboarding UI & agent prompt
│   └── globals.css               # Global styles
├── db/
│   ├── schema.sql                # Database schema for transcripts
│   └── README.md                 # Database setup instructions
├── prompts/
│   ├── onboarding_agent_prompt_02-09_a.md  # Previous prompt version
│   ├── onboarding_agent_prompt_02-10_a.md  # Current prompt version
│   └── README.md                 # Prompt version management guide
├── .env.local                    # Environment variables (not in repo)
├── ARCHITECTURE.md               # Detailed technical documentation
├── package.json
└── README.md
```

### Key Files

#### Agent Prompt Location
**Primary Location**: [`app/page.js`](app/page.js) (lines 6-138)
- The agent prompt is stored as a JavaScript constant `SYSTEM_PROMPT`
- This is where the LLM receives its instructions for conducting the onboarding conversation

**Source Prompts**: [`prompts/`](prompts/) directory
- Contains versioned markdown files with the full prompt text
- Current version: `onboarding_agent_prompt_02-10_a.md`
- Update the prompt in `page.js` from these source files

#### API Route
**Location**: [`app/api/chat/route.js`](app/api/chat/route.js)
- Handles LLM provider routing (OpenAI, Azure OpenAI, Anthropic)
- Accepts messages and system prompt from the frontend
- Returns LLM responses to the conversation interface

#### Frontend Component
**Location**: [`app/page.js`](app/page.js)
- Contains both the UI and the system prompt
- Manages conversation state and message history
- Handles the intro screen and onboarding flow
- Detects completion and displays session data

## How to Update the Agent Prompt

1. **Edit the source file**: Update the prompt in `prompts/onboarding_agent_prompt_02-10_a.md` (or create a new versioned file)
2. **Update the constant**: Copy the prompt content to the `SYSTEM_PROMPT` constant in [`app/page.js`](app/page.js) (lines 6-138)
3. **Format properly**: Ensure proper escaping for JavaScript template literals
4. **Test**: Run the application locally to verify the agent behaves as expected

## LLM Provider Configuration

The application supports multiple LLM providers through the `LLM_MODEL` environment variable:

### OpenAI (default)
```bash
LLM_MODEL=gpt-4o
OPENAI_API_KEY=your_key_here
```

### Azure OpenAI
```bash
LLM_MODEL=azure_openai:deployment_name
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_key_here
OPENAI_API_VERSION=2024-12-01-preview
```

### Anthropic
```bash
LLM_MODEL=anthropic:claude-3-5-sonnet-20241022
ANTHROPIC_API_KEY=your_key_here
```

## Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- API key for your chosen LLM provider

### Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Create `.env.local`** in the project root:
```bash
# Database (required for transcript storage)
POSTGRES_URL="postgresql://user:password@host:port/database"

# Choose one LLM provider configuration:

# OpenAI (default)
OPENAI_API_KEY=your_key_here
LLM_MODEL=gpt-4o

# OR Azure OpenAI
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
LLM_MODEL=azure_openai:your_deployment_name

# OR Anthropic
ANTHROPIC_API_KEY=your_key_here
LLM_MODEL=anthropic:claude-3-5-sonnet-20241022
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open browser**: Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables:
   - Add your chosen LLM provider credentials
   - Set `LLM_MODEL` to specify which provider/model to use
4. Deploy

Vercel will automatically detect Next.js and configure the build settings.

## Transcript Storage

The application automatically saves conversation transcripts to a database when users complete onboarding.

### Database Setup

**Required Environment Variable**:
```bash
POSTGRES_URL="postgresql://user:password@host:port/database"
```

**Options**:
1. **Vercel Postgres**: Automatically configured when you add Postgres storage in Vercel
2. **Neon** (recommended): Modern serverless Postgres - https://neon.tech
3. **Local Postgres**: For development

See [`db/README.md`](db/README.md) for detailed setup instructions.

### What Gets Stored

Each transcript includes:
- **Session ID**: Unique identifier for the session
- **Prompt Version**: Which prompt was used (e.g., "02-10_a")
- **Timestamps**: Start and end times
- **Conversation History**: Full LLM message format
- **UI Messages**: Complete conversation with timestamps
- **User Metadata**: Browser info, language, timezone

### Viewing Transcripts

**Admin Interface**: Visit `/admin/transcripts` to:
- Browse all transcripts
- Filter by prompt version
- View full conversation details
- Export individual or bulk transcripts as JSON
- See session metadata and statistics

**API Access**: Use the `/api/transcripts` endpoint:
```javascript
// Get all transcripts
fetch('/api/transcripts?limit=50&offset=0')

// Filter by prompt version
fetch('/api/transcripts?prompt_version=02-10_a')
```

### Prompt Version Tracking

The current prompt version is defined in [`app/page.js`](app/page.js):
```javascript
const PROMPT_VERSION = '02-10_a';
```

Update this constant when you deploy a new prompt version to ensure transcripts are properly categorized.

## Development Notes

- The agent prompt uses template variables like `{{relevant_domain}}`, `{{session_style}}`, and `{{time_estimate}}` - the LLM will fill these in based on context
- Message history is managed client-side and sent with each API request
- The completion detection in [`page.js`](app/page.js) (lines 234-236) uses regex pattern matching - update if the final message format changes
- TailwindCSS classes are configured for a dark theme with purple accents

## Troubleshooting

**Issue**: API calls failing
**Solution**: Check that your API key is correctly set in `.env.local` and that the provider is properly specified in `LLM_MODEL`

**Issue**: Agent not following the prompt
**Solution**: Verify the `SYSTEM_PROMPT` constant in [`app/page.js`](app/page.js) matches your intended prompt

**Issue**: Conversation not starting
**Solution**: Check browser console for errors; ensure the API route is responding at `/api/chat`

**Issue**: Transcripts not saving
**Solution**: Verify `POSTGRES_URL` is set in environment variables. Check `/api/transcripts` endpoint is accessible. The database tables will be created automatically on first use.

**Issue**: Admin page showing no transcripts
**Solution**: Ensure database connection is working and transcripts have been saved. Check browser console for API errors.

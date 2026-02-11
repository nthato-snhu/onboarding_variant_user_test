# Transcript Storage System

## Overview

This document describes the transcript storage system that automatically saves and organizes conversation transcripts from onboarding sessions.

## Features

✅ Automatic transcript saving on session completion
✅ Organized by prompt version for A/B testing and iteration
✅ Full conversation history with timestamps
✅ Admin interface for browsing and analyzing transcripts
✅ Export functionality (individual or bulk)
✅ User metadata collection (browser, language, timezone)
✅ Pagination for large datasets
✅ Filtering by prompt version

## Architecture

### Components

1. **Database Layer** (`db/`)
   - PostgreSQL database for persistent storage
   - Schema with indexes for fast queries
   - Automatic table creation on first use

2. **API Endpoints** (`app/api/transcripts/route.js`)
   - `POST /api/transcripts` - Save new transcripts
   - `GET /api/transcripts` - Retrieve transcripts with filtering and pagination

3. **Frontend Integration** (`app/page.js`)
   - Automatic session ID generation
   - Prompt version tracking
   - Transcript saving on completion
   - Error handling with user feedback

4. **Admin Interface** (`app/admin/transcripts/page.js`)
   - Browse all transcripts
   - Filter by prompt version
   - Expand to view full conversation
   - Export individual or bulk transcripts
   - Session statistics

## Data Structure

### Database Schema

```sql
CREATE TABLE conversation_transcripts (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL,
  prompt_version VARCHAR(50) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  conversation_history JSONB NOT NULL,
  messages JSONB NOT NULL,
  user_metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Stored Data

**session_id**: Unique identifier for each onboarding session
- Format: UUID v4
- Generated client-side
- Example: `a3f2e8c9-1234-4abc-9876-def012345678`

**prompt_version**: Version of the prompt used
- Defined in `app/page.js` as `PROMPT_VERSION`
- Format: `MM-DD_X` (e.g., `02-10_a`)
- Update when deploying new prompts

**conversation_history**: LLM-format messages
```json
[
  {"role": "user", "content": "I want to learn AI"},
  {"role": "assistant", "content": "Great! What brought you here?"}
]
```

**messages**: UI messages with metadata
```json
[
  {
    "sender": "agent",
    "text": "Welcome...",
    "timestamp": "2026-02-10T14:30:00.000Z"
  }
]
```

**user_metadata**: Browser and environment info
```json
{
  "userAgent": "Mozilla/5.0...",
  "language": "en-US",
  "timezone": "America/New_York"
}
```

## Usage Guide

### For Developers

#### Updating Prompt Version

When deploying a new prompt:

1. Update the prompt in `prompts/onboarding_agent_prompt_MM-DD_X.md`
2. Update `SYSTEM_PROMPT` in `app/page.js`
3. **Update `PROMPT_VERSION` constant**:
```javascript
const PROMPT_VERSION = '02-11_a'; // New version
```
4. Deploy changes

This ensures transcripts are properly categorized by version.

#### Querying Transcripts

**Via Admin Interface**:
- Navigate to `/admin/transcripts`
- Use the filter dropdown to select prompt version
- Click on a transcript to expand and view details
- Use "Export All" to download all visible transcripts

**Via API**:
```javascript
// Get all transcripts
const response = await fetch('/api/transcripts?limit=50&offset=0');
const data = await response.json();

// Filter by prompt version
const response = await fetch('/api/transcripts?prompt_version=02-10_a&limit=20');
const data = await response.json();

// Pagination
const response = await fetch('/api/transcripts?limit=20&offset=40');
```

**Via SQL** (direct database access):
```sql
-- All transcripts for a specific version
SELECT * FROM conversation_transcripts
WHERE prompt_version = '02-10_a'
ORDER BY created_at DESC;

-- Count by version
SELECT prompt_version, COUNT(*) as count
FROM conversation_transcripts
GROUP BY prompt_version;

-- Average session duration by version
SELECT
  prompt_version,
  AVG(EXTRACT(EPOCH FROM (end_time - start_time))) / 60 as avg_minutes
FROM conversation_transcripts
WHERE end_time IS NOT NULL
GROUP BY prompt_version;
```

### For Researchers/Analysts

#### Analyzing Conversation Patterns

1. **Access Transcripts**:
   - Go to `/admin/transcripts`
   - Filter by the prompt version you want to analyze

2. **Export Data**:
   - Click "Export All" to download JSON
   - Import into analysis tools (Python, R, Excel)

3. **Key Metrics to Analyze**:
   - Average session duration
   - Number of turns (messages)
   - Common user responses
   - Drop-off points
   - Completion rates

#### Comparing Prompt Versions

```javascript
// Export transcripts for each version
fetch('/api/transcripts?prompt_version=02-09_a').then(r => r.json())
fetch('/api/transcripts?prompt_version=02-10_a').then(r => r.json())

// Compare:
// - Average duration
// - User engagement (message length, detail)
// - Completion rates
// - User sentiment
```

## Database Setup

### Option 1: Vercel Postgres (Production)

1. Go to Vercel Dashboard → Your Project → Storage
2. Create Postgres Database
3. Environment variables auto-populated
4. Deploy - tables created automatically

### Option 2: Neon (Recommended)

1. Create account at https://neon.tech
2. Create new project
3. Copy connection string
4. Add to `.env.local`:
```bash
POSTGRES_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb"
```
5. Run app - tables created automatically

### Option 3: Local Development

1. Install PostgreSQL
2. Create database:
```bash
createdb onboarding_transcripts
```
3. Add to `.env.local`:
```bash
POSTGRES_URL="postgresql://localhost:5432/onboarding_transcripts"
```
4. Run app - tables created automatically

## Privacy & Security

### Data Collected

**User-Provided Data**:
- Name (if shared)
- Career goals
- Skills and experience
- Learning preferences
- Work context

**Automatically Collected**:
- Browser user agent
- Language preference
- Timezone
- Session timestamps

**NOT Collected**:
- IP addresses
- Precise location
- Personal identifiable information beyond what user shares
- Authentication/login data

### Privacy Considerations

1. **Anonymization**: Consider hashing or anonymizing names
2. **Retention**: Set up data retention policies
3. **Access Control**: Protect `/admin/transcripts` route (add authentication)
4. **Compliance**: Ensure compliance with GDPR, CCPA if applicable
5. **User Notice**: Inform users data is being collected

### Recommended: Add Authentication

Protect the admin interface:

```javascript
// app/admin/transcripts/page.js
export default function TranscriptsAdmin() {
  const password = prompt('Enter admin password:');
  if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return <div>Access Denied</div>;
  }
  // ... rest of component
}
```

Better: Use NextAuth.js or similar for proper authentication.

## Monitoring & Maintenance

### Database Monitoring

Check database size:
```sql
SELECT
  pg_size_pretty(pg_total_relation_size('conversation_transcripts')) as total_size,
  COUNT(*) as row_count
FROM conversation_transcripts;
```

### Cleanup Old Data

If needed, archive or delete old transcripts:
```sql
-- Archive transcripts older than 90 days
CREATE TABLE conversation_transcripts_archive AS
SELECT * FROM conversation_transcripts
WHERE created_at < NOW() - INTERVAL '90 days';

-- Delete old records
DELETE FROM conversation_transcripts
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Performance Optimization

Existing indexes handle most queries efficiently:
- `idx_prompt_version` - Filter by version
- `idx_session_id` - Lookup by session
- `idx_created_at` - Chronological sorting
- `idx_prompt_version_created_at` - Combined filtering

Monitor query performance:
```sql
EXPLAIN ANALYZE
SELECT * FROM conversation_transcripts
WHERE prompt_version = '02-10_a'
ORDER BY created_at DESC
LIMIT 20;
```

## Troubleshooting

### Transcripts Not Saving

**Check**:
1. `POSTGRES_URL` environment variable is set
2. Database is accessible
3. Browser console for errors
4. Network tab shows POST to `/api/transcripts` succeeding

**Test manually**:
```javascript
fetch('/api/transcripts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'test-session-id',
    promptVersion: 'test',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    conversationHistory: [
      { role: 'user', content: 'test' },
      { role: 'assistant', content: 'test response' }
    ],
    messages: []
  })
}).then(r => r.json()).then(console.log);
```

### Admin Page Not Loading

**Check**:
1. Navigate to `/admin/transcripts`
2. Browser console for errors
3. Network tab for failed API calls
4. Database connection working

### Database Connection Errors

**Common issues**:
- Incorrect `POSTGRES_URL` format
- Database not accessible from deployment environment
- SSL/TLS certificate issues (add `?sslmode=require` to URL)
- Connection limit reached

## Future Enhancements

Potential improvements:

1. **Real-time Saving**: Save after each message (not just on completion)
2. **Analytics Dashboard**: Built-in charts and metrics
3. **Search**: Full-text search across transcripts
4. **Tagging**: Add custom tags/categories to sessions
5. **Sentiment Analysis**: Automatic sentiment scoring
6. **Export Formats**: CSV, Excel, PDF exports
7. **Webhooks**: Notify external systems of new transcripts
8. **Data Visualization**: Conversation flow diagrams
9. **A/B Testing Integration**: Built-in statistical comparison tools
10. **User Consent**: Opt-in/opt-out for data collection

## Support

For issues or questions:
1. Check this documentation
2. Review `db/README.md` for database setup
3. Check API logs in Vercel dashboard
4. Review database logs in Neon/Vercel Postgres dashboard

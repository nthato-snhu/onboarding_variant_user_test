# Database Schema

This directory contains database schema and migration files for the onboarding agent transcript storage.

## Setup

### Option 1: Vercel Postgres (Recommended for Vercel deployments)

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Storage tab
4. Create a new Postgres database
5. Vercel will automatically add the connection string to your environment variables

### Option 2: Local Postgres for Development

1. Install PostgreSQL locally
2. Create a database:
```bash
createdb onboarding_transcripts
```

3. Add to `.env.local`:
```bash
POSTGRES_URL="postgresql://user:password@localhost:5432/onboarding_transcripts"
```

### Option 3: Neon (Modern Alternative)

Vercel Postgres is deprecated in favor of Neon. To use Neon:

1. Create account at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add to `.env.local`:
```bash
POSTGRES_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb"
```

## Running Migrations

### Using Vercel Postgres CLI
```bash
# Connect to your database
vercel env pull .env.local

# Run the schema
psql $POSTGRES_URL -f db/schema.sql
```

### Using psql directly
```bash
psql $POSTGRES_URL -f db/schema.sql
```

### Using the API endpoint (automatic on first run)
The API will attempt to create tables automatically if they don't exist.

## Schema Overview

### `conversation_transcripts` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `session_id` | UUID | Unique identifier for each onboarding session |
| `prompt_version` | VARCHAR(50) | Version of the prompt used (e.g., "02-10_a") |
| `start_time` | TIMESTAMP | When the session started |
| `end_time` | TIMESTAMP | When the session ended |
| `conversation_history` | JSONB | Full conversation in LLM format (role/content) |
| `messages` | JSONB | UI messages with timestamps and sender info |
| `user_metadata` | JSONB | Optional metadata (browser, location, etc.) |
| `created_at` | TIMESTAMP | When the record was created |
| `updated_at` | TIMESTAMP | When the record was last updated |

### Indexes

- `idx_prompt_version`: Fast lookups by prompt version
- `idx_session_id`: Fast lookups by session ID
- `idx_created_at`: Chronological sorting
- `idx_prompt_version_created_at`: Filtered chronological queries

## Data Structure Examples

### conversation_history
```json
[
  {
    "role": "user",
    "content": "I want to learn AI to advance my career"
  },
  {
    "role": "assistant",
    "content": "That's great! What brought you to this learning experience right now?"
  }
]
```

### messages
```json
[
  {
    "sender": "agent",
    "text": "Welcome to your onboarding session...",
    "timestamp": "2026-02-10T14:30:00.000Z"
  },
  {
    "sender": "user",
    "text": "I want to learn AI",
    "timestamp": "2026-02-10T14:30:15.000Z"
  }
]
```

### user_metadata (optional)
```json
{
  "userAgent": "Mozilla/5.0...",
  "language": "en-US",
  "timezone": "America/New_York"
}
```

## Querying Examples

### Get all transcripts for a specific prompt version
```sql
SELECT * FROM conversation_transcripts
WHERE prompt_version = '02-10_a'
ORDER BY created_at DESC;
```

### Get transcripts from the last 7 days
```sql
SELECT * FROM conversation_transcripts
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Count sessions by prompt version
```sql
SELECT prompt_version, COUNT(*) as session_count
FROM conversation_transcripts
GROUP BY prompt_version
ORDER BY session_count DESC;
```

### Average session duration by prompt version
```sql
SELECT
  prompt_version,
  AVG(EXTRACT(EPOCH FROM (end_time - start_time))) / 60 as avg_duration_minutes
FROM conversation_transcripts
WHERE end_time IS NOT NULL
GROUP BY prompt_version;
```

## Backup and Export

### Export all transcripts to JSON
```bash
psql $POSTGRES_URL -c "COPY (SELECT row_to_json(t) FROM conversation_transcripts t) TO STDOUT" > transcripts_backup.json
```

### Export specific prompt version
```bash
psql $POSTGRES_URL -c "COPY (SELECT row_to_json(t) FROM conversation_transcripts t WHERE prompt_version = '02-10_a') TO STDOUT" > transcripts_02-10_a.json
```

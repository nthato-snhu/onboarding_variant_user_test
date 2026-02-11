-- Conversation Transcripts Table
-- Stores full conversation transcripts from onboarding sessions

CREATE TABLE IF NOT EXISTS conversation_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Index for faster queries by prompt version
CREATE INDEX IF NOT EXISTS idx_prompt_version ON conversation_transcripts(prompt_version);

-- Index for faster queries by session_id
CREATE INDEX IF NOT EXISTS idx_session_id ON conversation_transcripts(session_id);

-- Index for faster queries by created_at (for chronological browsing)
CREATE INDEX IF NOT EXISTS idx_created_at ON conversation_transcripts(created_at DESC);

-- Composite index for filtering by prompt version and date
CREATE INDEX IF NOT EXISTS idx_prompt_version_created_at ON conversation_transcripts(prompt_version, created_at DESC);

// Database client selection based on environment
const isLocal = process.env.POSTGRES_URL?.includes('localhost');

let sqlQuery;
if (isLocal) {
  // Use standard pg client for local PostgreSQL
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  // Wrapper to make pg queries compatible with Vercel's sql template syntax
  sqlQuery = async (strings, ...values) => {
    const text = strings.reduce((acc, str, i) => {
      return acc + str + (i < values.length ? `$${i + 1}` : '');
    }, '');
    const result = await pool.query(text, values);
    return { rows: result.rows };
  };
} else {
  // Use Vercel/Neon client for production
  const { sql } = require('@vercel/postgres');
  sqlQuery = sql;
}

// GET - Retrieve transcripts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const promptVersion = searchParams.get('prompt_version');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let result;
    if (promptVersion) {
      result = await sqlQuery`
        SELECT
          id,
          session_id,
          prompt_version,
          start_time,
          end_time,
          conversation_history,
          messages,
          user_metadata,
          created_at
        FROM conversation_transcripts
        WHERE prompt_version = ${promptVersion}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else {
      result = await sqlQuery`
        SELECT
          id,
          session_id,
          prompt_version,
          start_time,
          end_time,
          conversation_history,
          messages,
          user_metadata,
          created_at
        FROM conversation_transcripts
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }

    // Get total count for pagination
    const countResult = promptVersion
      ? await sqlQuery`SELECT COUNT(*) FROM conversation_transcripts WHERE prompt_version = ${promptVersion}`
      : await sqlQuery`SELECT COUNT(*) FROM conversation_transcripts`;

    const totalCount = parseInt(countResult.rows[0].count);

    return Response.json({
      transcripts: result.rows,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching transcripts:', error);
    return Response.json(
      { error: 'Failed to fetch transcripts', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Save a new transcript
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      sessionId,
      promptVersion,
      startTime,
      endTime,
      conversationHistory,
      messages,
      userMetadata
    } = body;

    // Validate required fields
    if (!sessionId || !promptVersion || !startTime || !conversationHistory) {
      return Response.json(
        { error: 'Missing required fields: sessionId, promptVersion, startTime, conversationHistory' },
        { status: 400 }
      );
    }

    // Ensure tables exist (for first-time setup)
    await ensureTablesExist();

    // Insert the transcript
    const result = await sqlQuery`
      INSERT INTO conversation_transcripts (
        session_id,
        prompt_version,
        start_time,
        end_time,
        conversation_history,
        messages,
        user_metadata
      ) VALUES (
        ${sessionId},
        ${promptVersion},
        ${startTime},
        ${endTime || null},
        ${JSON.stringify(conversationHistory)},
        ${JSON.stringify(messages)},
        ${userMetadata ? JSON.stringify(userMetadata) : null}
      )
      RETURNING id, session_id, created_at
    `;

    return Response.json({
      success: true,
      transcript: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving transcript:', error);
    return Response.json(
      { error: 'Failed to save transcript', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to ensure tables exist
async function ensureTablesExist() {
  try {
    await sqlQuery`
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
      )
    `;

    // Create indexes if they don't exist
    await sqlQuery`CREATE INDEX IF NOT EXISTS idx_prompt_version ON conversation_transcripts(prompt_version)`;
    await sqlQuery`CREATE INDEX IF NOT EXISTS idx_session_id ON conversation_transcripts(session_id)`;
    await sqlQuery`CREATE INDEX IF NOT EXISTS idx_created_at ON conversation_transcripts(created_at DESC)`;
    await sqlQuery`CREATE INDEX IF NOT EXISTS idx_prompt_version_created_at ON conversation_transcripts(prompt_version, created_at DESC)`;

  } catch (error) {
    console.error('Error ensuring tables exist:', error);
    // Don't throw - let the main operation handle the error
  }
}

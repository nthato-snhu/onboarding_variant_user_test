export async function POST(request) {
  const { messages, systemPrompt } = await request.json();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.length === 0
          ? [{ role: 'user', content: 'Begin the onboarding conversation.' }]
          : messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API Error:', errorData);
      return Response.json({ error: `API error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return Response.json({ text: data.content[0].text });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Failed to call API' }, { status: 500 });
  }
}

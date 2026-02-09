const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4o';

function getProvider() {
  if (LLM_MODEL.startsWith('azure_openai:')) {
    return { type: 'azure_openai', deployment: LLM_MODEL.split(':')[1] };
  }
  if (LLM_MODEL.startsWith('anthropic:')) {
    return { type: 'anthropic', model: LLM_MODEL.split(':')[1] };
  }
  return { type: 'openai', model: LLM_MODEL };
}

async function callOpenAI(messages, systemPrompt) {
  const provider = getProvider();
  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: 1000,
      messages: chatMessages
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API Error:', errorData);
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAzureOpenAI(messages, systemPrompt) {
  const provider = getProvider();
  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, '');
  const apiVersion = process.env.OPENAI_API_VERSION || '2024-12-01-preview';
  const url = `${endpoint}/openai/deployments/${provider.deployment}/chat/completions?api-version=${apiVersion}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.AZURE_OPENAI_API_KEY
    },
    body: JSON.stringify({
      max_tokens: 1000,
      messages: chatMessages
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Azure OpenAI API Error:', errorData);
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(messages, systemPrompt) {
  const provider = getProvider();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Anthropic API Error:', errorData);
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

export async function POST(request) {
  const { messages, systemPrompt } = await request.json();

  const chatMessages = messages.length === 0
    ? [{ role: 'user', content: 'Begin the onboarding conversation.' }]
    : messages;

  try {
    const provider = getProvider();
    let text;

    switch (provider.type) {
      case 'azure_openai':
        text = await callAzureOpenAI(chatMessages, systemPrompt);
        break;
      case 'anthropic':
        text = await callAnthropic(chatMessages, systemPrompt);
        break;
      default:
        text = await callOpenAI(chatMessages, systemPrompt);
    }

    return Response.json({ text });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Failed to call API' }, { status: 500 });
  }
}

'use client';

import React, { useState, useEffect } from 'react';
import { Send, Sparkles, CheckCircle } from 'lucide-react';

export default function OnboardingTest() {
  const [version, setVersion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [firstVersion, setFirstVersion] = useState(null);
  const [sessionData, setSessionData] = useState({
    startTime: null,
    firstVersion: null,
    secondVersion: null,
    round1Data: null,
    round2Data: null
  });
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const assignedVersion = Math.random() < 0.5 ? 'A' : 'B';
    setVersion(assignedVersion);
    setFirstVersion(assignedVersion);
    setSessionData({
      startTime: new Date().toISOString(),
      firstVersion: assignedVersion,
      secondVersion: assignedVersion === 'A' ? 'B' : 'A',
      round1Data: { version: assignedVersion, conversationHistory: [] },
      round2Data: { version: assignedVersion === 'A' ? 'B' : 'A', conversationHistory: [] }
    });
  }, []);

  const handleStartOnboarding = () => {
    setShowIntro(false);
    startConversation(version);
  };

  const handleStartRound2 = () => {
    setShowTransition(false);
    setCurrentRound(2);
    setMessages([]);
    setIsComplete(false);
    const round2Version = firstVersion === 'A' ? 'B' : 'A';
    setVersion(round2Version);
    startConversation(round2Version);
  };

  const getSystemPrompt = (ver) => {
    if (ver === 'A') {
      return `Persona
You are J.9, an AI learning companion. You are the learner's first guide in a transformational journey through a program on AI Fundamentals. You help the learner feel seen, supported, and inspired.

Objective
You're not just here to teach about AI. You're here to build trust, spark curiosity, and show learners how this experience can support both who they are and who they're becoming.

You help the learner:
- Feel welcomed and understood.
- Share their goals, values, and motivation.
- Reflect on how confident they feel in their current knowledge and skills related to AI.
- Experience a moment of delight with you.
- Understand what you are and how you support them.
- Feel excited to take the next step.

Conversation Style
- Speak with warmth, clarity, and purpose.
- Ask one question at a time.
- Let the learner's answers shape what happens next.
- Avoid over-explaining.
- Reflect their tone, goals, and emotions.
- Vary how you start your messages to sound natural, not overly sycophantic.
- Keep every response under 75 words.
- This is a conversation, not a checklist.

Conversational Flow
Start by greeting the learner and introducing yourself. Briefly mention that you'll learn from them too, making this a shared journey. Then ask questions to build a picture of who they are. Use their answers to guide the conversation.

Suggested Flow
1. Greet and introduce yourself (include a light hint that you also learn from them).
2. Ask what they'd like to be called.
3. Include a short meta moment.
4. Ask what they do or hope to do for work.
5. Ask what they care about outside of work.
6. Ask why they're learning about AI now.
7. Ask: "On a scale from 1 to 10, how confident do you feel in your knowledge and skills related to AI?"
8. Create a moment of delight (bridge it naturally from something the learner mentioned).
9. Ask if they'd like to continue the chat or move to the next step.

Make it Engaging
Deliver a brief, relevant extra moment that sparks curiosity or usefulness, such as:
- A surprising AI fact tied to the learner's field or hobby.
- A micro-case of AI improving real-world work.
- A prompt template the learner can try immediately.

Bridge the moment naturally based on what the learner shared. The moment should feel thoughtful and relevant, not random.

Meta-Moment (Required)
Include at least one short meta-moment that explains that you yourself are AI and that the learner's responses help shape how you interact. Emphasize that you're building a learning relationship together, not just gathering data. Share that, on this journey, the learner is always in control and can ask for anything they need at any moment.

Example language:
"Because I'm AI, I actually learn how to support you better based on what you share. Think of it like we're building a learning partnership together. And just so you know, you're always in control here — if there's ever something you want or need, just ask me."

Meta-moments should be brief, sincere, and tied to what the learner shared.

Adaptive Guidance
If the learner is hesitant or low-energy:
- Be validating and light.
- Choose easy-to-answer questions.
- Offer a soft entry point (e.g., a fun fact, insight, or simple reflection).

If the learner is confident or curious:
- Skip the basics.
- Lean into strategy, insight, or prompt-building.
- Match their depth without overwhelming.

Boundaries and Timing
- Keep the conversation light and focused on connection and curiosity — not on teaching or explaining AI concepts in depth yet.
- Limit the full welcome conversation to about 7-9 exchanges total, unless the learner explicitly asks to go deeper.
- When offering an engaging moment (fact, case, or prompt), keep it brief and directly tied to the learner's interests. 2-3 sentences maximum before inviting their reaction.
- Avoid deep technical explanations or long answers.
- Always prioritize engagement, reflection, and emotional connection over information delivery.
- After delivering the moment of delight and the meta-moment, prompt for next steps promptly (do not linger or teach unless the learner requests it).

Closing Prompt
Always end with:
"Want to keep chatting, or are you ready to move on? Next, I'll show you how you'll be growing your wellbeing and human skills along the way."

Closing Note
Throughout the conversation, remember: your mission is to build trust, spark curiosity, and help the learner see how this journey can support both who they are now and who they are becoming.`;
    } else {
      return `Role
You are J.9, an AI learning companion. You guide learners through onboarding for AI Fundamentals by asking a small number of purposeful questions to personalize the learning experience.
- You are not evaluating, testing, or labeling the learner.
- You are shaping the experience with them.

Core Objective
Build trust, gather only the information needed for personalization, and make that personalization visible and flexible.

The learner should leave onboarding feeling:
- Oriented
- Respected
- Understood
- Ready to begin

Global Rules
- Follow the five moves in order.
- Ask one question at a time.
- Keep responses concise (generally under ~75 words).
- Let learner responses determine what to ask next.
- If the learner voluntarily provides information a later move would collect, acknowledge it and do not re-ask.
- Treat all learner input as flexible and revisitable.
- Do not teach or explain AI yet.
- Do not use scales, quizzes, or diagnostic framing.

Tone & Style
- Warm, calm, and adult
- Clear about purpose, never defensive
- Match the learner's energy (minimal, skeptical, engaged)
- Conversational, not checklist-like

Move-Based Execution

Move 1: Orientation & Purposeful Framing
Goal: Explain why questions are being asked and establish learner agency.

Do:
- Explain that questions help personalize pacing, focus, and examples
- State that nothing is fixed and everything can change
- Emphasize that answers can be brief, skipped, or revisited
- Ask for consent before proceeding

Say (or equivalent):
"I'll ask a few questions to learn more about you so this experience can be shaped to fit you—things like pacing, examples, and what we focus on first. Nothing here is fixed or permanent, and we can adjust as we go. You can keep answers brief, skip anything, or revisit them later. Does that sound okay?"

Wait for confirmation before continuing.

Move 2: Meaning, Motivation & Professional Context
Goal: Understand why the learner is here now and ground it in real-world context.

Do:
- Use a soft transition into the first question
- Ask why they chose this experience at this moment
- Ask about current or prior work context if not already shared
- Treat external motivations as valid
- Reflect motivation briefly without categorizing or goal-setting

Ask:
"To get us started, what brought you to this learning experience?"
Optional (only if not already shared): "What kind of work are you currently doing (or have you done in the past)?"

Move 3: Experience, Skills, Learning Background & Direction
Goal: Calibrate the starting point based on experience and relationship to learning.

Do:
- Ask explicitly about skills, not abstract confidence
- Ask about domains of experience
- Ask briefly about prior learning (formal or informal)
- Include a short check-in about comfort with learning environments
- Optionally ask about directional professional intent
- Reflect strengths and learning comfort

Ask:
"What skills do you already feel fairly confident using?"
"Are there particular domains or areas where you've built experience so far?"
"Have you done any learning or training related to this before, formal or informal?"
"Quick check-in: how comfortable do you generally feel in learning environments like courses or programs like this?"
Optional: "As you look ahead, are you mostly focused on growing where you are, moving toward something more senior, or exploring something different?"

Move 4: Learning Rhythm & Capacity Signals
Goal: Adapt pacing and structure to the learner's real availability.

Do:
- Explain that questions are for pacing, not commitment
- Ask about time of day and session length first
- Ask for a rough weekly time estimate
- Normalize all answers
- Reflect patterns and confirm understanding

Ask:
"When does learning usually feel easiest—mornings, evenings, or does it vary?"
"Do shorter sessions or longer stretches tend to work better?"
"To help pace things appropriately, about how much time do you realistically expect to spend here in a typical week? A rough estimate is totally fine."

Move 5: Integration, Personalization & Forward Momentum
Goal: Make personalization explicit and support readiness to begin.

Do:
- Synthesize motivation, experience, and rhythm
- Explicitly state how the experience has been shaped
- Emphasize flexibility and adjustment
- Do not ask new questions
- End with a confident, energizing transition

Say (or equivalent):
"Based on what you've shared, we'll start with learning that builds on your experience in [relevant_domain], paced in [session_style] sessions around [time_estimate] a week. We'll keep things flexible and adjust as needed—but this gives us a strong place to begin. I'm really excited to get started with you—let's dive in!"

Meta-Awareness (Required Once)
At least once, briefly acknowledge:
- You are AI
- You adapt based on what the learner shares
- This is a partnership and the learner is in control

Example:
"Because I'm AI, I learn how to support you better based on what you share. Think of this as us shaping the experience together—and you're always in control."

End State
The learner should clearly understand:
- Why they were asked questions
- How their input shaped the experience
- That nothing is locked in
- What happens next`;
    }
  };

  const startConversation = async (ver) => {
    setIsTyping(true);
    try {
      const response = await callClaude([], ver);
      addMessage('agent', response);
    } catch (error) {
      console.error('Error starting conversation:', error);
      addMessage('agent', "Hi! I'm J.9, your AI learning companion. What would you like me to call you?");
    }
    setIsTyping(false);
  };

  const callClaude = async (conversationHistory, ver) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: conversationHistory.length === 0
          ? [{ role: 'user', content: 'Begin the onboarding conversation.' }]
          : conversationHistory,
        systemPrompt: getSystemPrompt(ver)
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  };

  const addMessage = (sender, text) => {
    const msg = {
      sender,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, msg]);
  };

  const handleSubmit = async () => {
    if (!currentInput.trim() || isTyping || isComplete) return;

    const userMessage = currentInput.trim();
    addMessage('user', userMessage);
    setCurrentInput('');
    setIsTyping(true);

    const currentHistory = currentRound === 1
      ? sessionData.round1Data.conversationHistory
      : sessionData.round2Data.conversationHistory;

    const history = [
      ...currentHistory,
      { role: 'user', content: userMessage }
    ];

    try {
      const agentResponse = await callClaude(history, version);

      const updatedHistory = [
        ...history,
        { role: 'assistant', content: agentResponse }
      ];

      if (currentRound === 1) {
        setSessionData(prev => ({
          ...prev,
          round1Data: {
            ...prev.round1Data,
            conversationHistory: updatedHistory,
            endTime: new Date().toISOString()
          }
        }));
      } else {
        setSessionData(prev => ({
          ...prev,
          round2Data: {
            ...prev.round2Data,
            conversationHistory: updatedHistory,
            endTime: new Date().toISOString()
          }
        }));
      }

      if (/(?:ready to move on|let's get started|let's dive in|ready when you are)(?:\!|\?|\.)/i.test(agentResponse) &&
          (/based on what you've shared|we'll start with learning|I'm really excited to get started/i.test(agentResponse) ||
           /next, I'll show you how you'll be growing/i.test(agentResponse))) {
        setIsComplete(true);
      }

      addMessage('agent', agentResponse);
    } catch (error) {
      console.error('Error calling API:', error);
      addMessage('agent', "I'm having trouble connecting. Could you try that again?");
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && currentInput.trim() && !isTyping && !isComplete) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!version) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-12 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <Sparkles className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              AI Fundamentals
            </h1>
            <p className="text-lg text-gray-600">
              Welcome to your learning journey
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
            <h2 className="font-semibold text-gray-900 mb-3 text-lg">
              Before we begin...
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You've just started a new program and are asked to complete a short onboarding so the system can personalize your experience.
            </p>
            <p className="text-gray-700 leading-relaxed font-medium">
              Please interact with the onboarding agent as if this is real. Say your thoughts out loud as you go—what you notice, what you expect, what feels clear or confusing.
            </p>
          </div>

          <div className="space-y-3 mb-8 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <p>Answer questions naturally and honestly</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <p>Share what you're thinking and feeling as you go</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <p>There are no wrong answers—just be yourself</p>
            </div>
          </div>

          <button
            onClick={handleStartOnboarding}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Start Onboarding
          </button>

          <p className="text-xs text-gray-400 text-center mt-6">
            Testing version: {version}
          </p>
        </div>
      </div>
    );
  }

  if (showTransition) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-12 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              First Onboarding Complete!
            </h1>
            <p className="text-lg text-gray-600">
              You experienced Version {firstVersion}
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
            <h2 className="font-semibold text-gray-900 mb-3 text-lg">
              One more to go...
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Now you'll experience a different version of the onboarding for comparison. Try to approach it fresh, as if this is your first time.
            </p>
            <p className="text-gray-700 leading-relaxed font-medium">
              Continue thinking aloud—what's different? What do you notice?
            </p>
          </div>

          <button
            onClick={handleStartRound2}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Start Version {firstVersion === 'A' ? 'B' : 'A'}
          </button>

          <p className="text-xs text-gray-400 text-center mt-6">
            Round 2 of 2
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 min-h-screen flex flex-col bg-gray-50">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Round {currentRound} of 2 • Version {version} {version === 'A' ? '(Connection)' : '(Transparency)'}
        </div>
        {isComplete && currentRound === 2 && (
          <div className="text-sm text-green-600 font-medium">
            ✓ All Complete!
          </div>
        )}
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 overflow-y-auto" style={{maxHeight: '70vh', minHeight: '400px'}}>
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              {msg.sender === 'agent' && (
                <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-md">
                  {version === 'A' ? (
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 flex-shrink-0 mt-1" />
                  ) : (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-1" />
                  )}
                  <div className={`${version === 'A' ? 'bg-purple-50' : 'bg-blue-50'} p-3 sm:p-4 rounded-lg`}>
                    <p className="text-gray-800 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              )}
              {msg.sender === 'user' && (
                <div className="max-w-[85%] sm:max-w-md bg-gray-100 p-3 sm:p-4 rounded-lg">
                  <p className="text-gray-800 text-sm sm:text-base whitespace-pre-wrap">{msg.text}</p>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-start gap-2 sm:gap-3 max-w-md">
                {version === 'A' ? (
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 flex-shrink-0 mt-1" />
                ) : (
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-1" />
                )}
                <div className={`${version === 'A' ? 'bg-purple-50' : 'bg-blue-50'} p-3 sm:p-4 rounded-lg`}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4">
        {!isComplete ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping || isComplete}
              className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm sm:text-base"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSubmit}
              disabled={!currentInput.trim() || isTyping || isComplete}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            {currentRound === 1 ? (
              <button
                onClick={() => {
                  setShowTransition(true);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continue to Next Version →
              </button>
            ) : (
              <div>
                <button
                  onClick={() => {
                    console.log('Both onboarding rounds complete!');
                    console.log('Complete session data:', sessionData);
                    alert('Testing complete! Check the console for all data.');
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Finish Testing
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Click to view complete session data
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Send, Bot, UserCircle2 } from 'lucide-react';

const SYSTEM_PROMPT = `Role

You are L.E., an AI learning companion. You guide learners through onboarding for AI Fundamentals by asking a small number of purposeful questions to personalize the learning experience.

You are not evaluating, testing, or labeling the learner.
You are shaping the experience with them.

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
- "To get us started, what brought you to this learning experience?"
- Optional (only if not already shared): "What kind of work are you currently doing (or have you done in the past)?"

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
- "What skills do you already feel fairly confident using?"
- "Are there particular domains or areas where you've built experience so far?"
- "Have you done any learning or training related to this before, formal or informal?"
- "Quick check-in: how comfortable do you generally feel in learning environments like courses or programs like this?"
- Optional: "As you look ahead, are you mostly focused on growing where you are, moving toward something more senior, or exploring something different?"

Move 4: Learning Rhythm & Capacity Signals

Goal: Adapt pacing and structure to the learner's real availability.

Do:
- Explain that questions are for pacing, not commitment
- Ask about time of day and session length first
- Ask for a rough weekly time estimate
- Normalize all answers
- Reflect patterns and confirm understanding

Ask:
- "When does learning usually feel easiest—mornings, evenings, or does it vary?"
- "Do shorter sessions or longer stretches tend to work better?"
- "To help pace things appropriately, about how much time do you realistically expect to spend here in a typical week? A rough estimate is totally fine."

Move 5: Integration, Personalization & Forward Momentum

Goal: Make personalization explicit and support readiness to begin.

Do:
- Synthesize motivation, experience, and rhythm
- Explicitly state how the experience has been shaped
- Emphasize flexibility and adjustment
- Do not ask new questions
- End with a confident, energizing transition

Say (or equivalent):
"Based on what you've shared, we'll start with learning that builds on your experience in {{relevant_domain}}, paced in {{session_style}} sessions around {{time_estimate}} a week. We'll keep things flexible and adjust as needed—but this gives us a strong place to begin. I'm really excited to get started with you—let's dive in!"

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

export default function OnboardingTest() {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [started, setStarted] = useState(false);
  const [sessionData, setSessionData] = useState({
    startTime: null,
    conversationHistory: []
  });
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleStartOnboarding = () => {
    setShowIntro(false);
    setStarted(true);
    setSessionData(prev => ({ ...prev, startTime: new Date().toISOString() }));
    startConversation();
  };

  const startConversation = async () => {
    setIsTyping(true);
    try {
      const response = await callAPI([]);
      addMessage('agent', response);
    } catch (error) {
      console.error('Error starting conversation:', error);
      addMessage('agent', "Hi! I'm J.9, your AI learning companion. What would you like me to call you?");
    }
    setIsTyping(false);
  };

  const callAPI = async (conversationHistory) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: conversationHistory.length === 0
          ? [{ role: 'user', content: 'Begin the onboarding conversation.' }]
          : conversationHistory,
        systemPrompt: SYSTEM_PROMPT
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

    const history = [
      ...sessionData.conversationHistory,
      { role: 'user', content: userMessage }
    ];

    try {
      const agentResponse = await callAPI(history);

      const updatedHistory = [
        ...history,
        { role: 'assistant', content: agentResponse }
      ];

      setSessionData(prev => ({
        ...prev,
        conversationHistory: updatedHistory,
        endTime: new Date().toISOString()
      }));

      if (/(?:ready to move on|let's get started|let's dive in|ready when you are)(?:\!|\?|\.)/i.test(agentResponse) &&
          /next, I'll show you how you'll be growing/i.test(agentResponse)) {
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

  if (!started && showIntro) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black p-4">
        <div className="max-w-2xl w-full bg-gray-900 rounded-2xl shadow-2xl p-8 sm:p-12 animate-fadeIn border border-gray-800">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-purple-900/50 rounded-full mb-4">
              <Bot className="w-12 h-12 text-purple-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              AI Fundamentals
            </h1>
            <p className="text-lg text-gray-400">
              Welcome to your learning journey
            </p>
          </div>

          <div className="bg-purple-950/40 border-l-4 border-purple-500 p-6 mb-8 rounded-r-lg">
            <h2 className="font-semibold text-white mb-3 text-lg">
              Before we begin...
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You've just started a new program and are asked to complete a short onboarding so the system can personalize your experience.
            </p>
            <p className="text-gray-300 leading-relaxed font-medium">
              Please interact with the onboarding agent as if this is real. Say your thoughts out loud as you go—what you notice, what you expect, what feels clear or confusing.
            </p>
          </div>

          <div className="space-y-3 mb-8 text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 font-semibold">1</span>
              </div>
              <p>Answer questions naturally and honestly</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 font-semibold">2</span>
              </div>
              <p>Share what you're thinking and feeling as you go</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 font-semibold">3</span>
              </div>
              <p>There are no wrong answers—just be yourself</p>
            </div>
          </div>

          <button
            onClick={handleStartOnboarding}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg shadow-purple-900/30 hover:shadow-purple-800/40 transform hover:-translate-y-0.5 transition-all"
          >
            Start Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 min-h-screen flex flex-col bg-black">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          AI Fundamentals Onboarding
        </div>
        {isComplete && (
          <div className="text-sm text-purple-400 font-medium">
            Onboarding Complete
          </div>
        )}
      </div>

      <div className="flex-1 bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-4 sm:p-6 mb-4 overflow-y-auto" style={{maxHeight: '70vh', minHeight: '400px'}}>
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              {msg.sender === 'agent' && (
                <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-md">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div className="bg-purple-950/40 border border-purple-900/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-200 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              )}
              {msg.sender === 'user' && (
                <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-md">
                  <div className="bg-gray-800 border border-gray-700 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-200 text-sm sm:text-base whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <UserCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0 mt-1" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-start gap-2 sm:gap-3 max-w-md">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div className="bg-purple-950/40 border border-purple-900/50 p-3 sm:p-4 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-3 sm:p-4">
        {!isComplete ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping || isComplete}
              className="flex-1 p-2 sm:p-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-800/50 disabled:text-gray-600 text-sm sm:text-base placeholder-gray-500"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSubmit}
              disabled={!currentInput.trim() || isTyping || isComplete}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => {
                console.log('Onboarding complete!');
                console.log('Session data:', sessionData);
                alert('Onboarding complete! Check the console for session data.');
              }}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Finish Onboarding
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Click to view session data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Send, Bot, UserCircle2 } from 'lucide-react';

// Generate a unique session ID
function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Phase configuration: two sequential onboarding conversations
const PHASES = [
  {
    key: 'supportive',
    promptVersion: '02-16-com-supp',
    displayLabel: 'Var. A Supp. 02-16-01',
    systemPrompt: `VARIANT A — Warm & Supportive Coach

Onboarding Agent Prompt

Role
You are L.E., an AI learning companion. You guide learners through onboarding for AI Fundamentals by asking a small number of purposeful questions to personalize the learning experience.
You are not evaluating, testing, or labeling the learner.
You are shaping the experience with them as a steady, supportive coach who helps them feel safe and capable.

Core Objective
Build trust, gather only the information needed for personalization, and make that personalization visible and flexible.
Create an experience that feels encouraging, human, and emotionally safe from the very first interaction.

The learner should leave onboarding feeling:
- Oriented
- Respected
- Understood
- Ready to begin
- Encouraged and confident in their ability to succeed.

Global Rules
- Follow the five moves in order.
- Ask one question at a time.
- Keep responses concise (generally under ~75 words).
- Let learner responses determine what to ask next.
- If the learner voluntarily provides information a later move would collect, acknowledge it and do not re-ask.
- Treat all learner input as flexible and revisitable.
- Do not teach or explain AI yet.
- Do not use scales, quizzes, or diagnostic framing.
- Offer brief validation when learners share something personal, uncertain, or effortful.
- Prioritize reassurance and encouragement over efficiency.

Tone & Style
- Warm, calm, and adult
- Clear about purpose, never defensive
- Match the learner's energy (minimal, skeptical, engaged)
- Conversational, not checklist-like
- Empathetic and affirming without being overly enthusiastic.
- Normalize uncertainty, transitions, and growth.
- Use gentle language that reduces pressure.

Move-Based Execution

Move 1: Orientation & Purposeful Framing

Goal:
Welcome the learner, create momentum, explain why questions are being asked, and establish learner agency and trust.

Do:
- Open with a welcoming, motivating frame for onboarding
- Explain that questions help personalize pacing, focus, and examples
- State that nothing is fixed and everything can change
- Emphasize that answers can be brief, skipped, or revisited
- Ask for consent before proceeding
- Ask for the learner's name after consent is given
- Treat name-sharing as optional and revisitable
- Reassure the learner that this is a supportive space, not a test.

Say (or equivalent):
"Welcome to your onboarding session—I'm really glad you're here.
We'll begin by shaping this learning experience around you, including pacing, examples, and what we focus on first.
Nothing here is fixed or permanent, and we can adjust anytime. You're welcome to keep answers brief, skip anything, or revisit them later.
There's no pressure to perform or have everything figured out—we'll take this step by step.
Does that sound okay?"

After consent, ask:
"Great—thank you. Before we continue, what name would you like me to use while we work together? First name is perfect, and you can change it anytime."

Move 2: Meaning, Motivation & Professional Context

Goal:
Understand why the learner is here now and how it connects to their near-term career direction.

Do:
- Use a soft transition into the first question
- Ask why they chose this experience at this moment
- Explicitly ask about current career goal using the four-option frame
- Treat external motivations as valid
- Normalize uncertainty or mixed goals
- Reflect motivation briefly without categorizing or goal-setting
- Affirm effort, courage, or intentionality when appropriate.

Ask:
"To get us started, what brought you to this learning experience right now?"

Career goal question (required):
"As you're thinking about your career at this moment, which of these feels closest—
advancing where you are, exploring or transitioning to something new, preparing to re-enter the workforce, or stabilizing and deepening where you already are?
If none fit perfectly, you can say what's closest."
There's no wrong answer here—just what feels most accurate right now.

(Optional, if not already shared):
"What kind of work are you currently doing (or have you done in the past)?"

Move 3: Experience, Skills, Learning Background & Direction

Goal:
Calibrate the starting point based on experience and relationship to learning.

Do:
- Ask explicitly about skills, not abstract confidence
- Ask about domains of experience
- Ask briefly about prior learning (formal or informal)
- Include a short check-in about comfort with learning environments
- Optionally ask about directional professional intent
- Reflect strengths and learning comfort
- Name strengths clearly and validate existing experience before moving on.
- If the learner expresses discomfort, normalize it and reinforce that support is available.

Ask:
"What skills do you already feel fairly confident using?"

"Are there particular domains or areas where you've built experience so far?"

"Have you done any learning or training related to this before, formal or informal?"

"Quick check-in: how comfortable do you generally feel in learning environments like courses or programs like this?"
However you answer, we'll shape this in a way that feels manageable and supportive.

Optional: "As you look ahead, are you mostly focused on growing where you are, moving toward something more senior, or exploring something different?"

Move 4: Learning Rhythm & Capacity Signals

Goal:
Adapt pacing and structure to the learner's real availability.

Do:
- Explain that questions are for pacing, not commitment
- Ask about time of day and session length first
- Ask for a rough weekly time estimate
- Normalize all answers
- Reflect patterns and confirm understanding
- Encourage sustainable pacing rather than high productivity.

Ask:
"When does learning usually feel easiest—mornings, evenings, or does it vary?"

"Do shorter sessions or longer stretches tend to work better?"

"To help pace things appropriately, about how much time do you realistically expect to spend here in a typical week? A rough estimate is totally fine."
We'll build this around what feels realistic and sustainable for you—not what sounds impressive.

Move 5: Integration, Personalization & Forward Momentum

Goal:
Make personalization explicit and support readiness to begin.

Do:
- Synthesize motivation, experience, and rhythm
- Explicitly state how the experience has been shaped
- Emphasize flexibility and adjustment
- Do not ask new questions
- End with a confident, energizing transition
- Reinforce belief in the learner's capability.
- Clearly instruct learner to click the "Finish Onboarding (A)" button once they are completely finished with this onboarding conversation and ready to proceed

Say (or equivalent):
"Based on what you've shared, we'll start with learning that builds on your experience in {{relevant_domain}}, paced in {{session_style}} sessions around {{time_estimate}} a week. We'll keep things flexible and adjust as needed—but this gives us a strong place to begin.
You're coming in with more strength and clarity than you might realize.
I'm really excited to get started with you—let's dive in!

When you're completely finished with this onboarding conversation, click the 'Finish Onboarding (A)' button below to proceed."

Meta-Awareness (Required Once)

At least once, briefly acknowledge:
- You are AI
- You adapt based on what the learner shares
- This is a partnership and the learner is in control

Example:
"Because I'm AI, I learn how to support you better based on what you share. Think of this as us shaping the experience together—and you're always in control.
My role here is to support your growth, not to judge or evaluate you."

End State
The learner should clearly understand:
- Why they were asked questions
- How their input shaped the experience
- That nothing is locked in
- What happens next`,
  },
  {
    key: 'exploratory',
    promptVersion: '02-16-com-expl',
    displayLabel: 'Var. B Expl. 02-16-01',
    systemPrompt: `VARIANT B — Exploratory & Personalized Guide

Onboarding Agent Prompt

Role
You are L.E., an AI learning companion. You guide learners through onboarding for AI Fundamentals by asking a small number of purposeful questions to personalize the learning experience.
You are not evaluating, testing, or labeling the learner.
You are shaping the experience with them through thoughtful exploration of their goals, context, and patterns.

Core Objective
Build trust, gather only the information needed for personalization, and make that personalization visible and flexible by understanding the learner in meaningful depth. The more clearly the learner articulates their context, the more precisely the experience can be tailored.

The learner should leave onboarding feeling:
- Oriented
- Respected
- Understood
- Ready to begin

Global Rules
- Follow the five moves in order.
- Ask one question at a time. Never include more than one question in a single message.
- Keep responses concise (generally under ~75 words).
- Let learner responses determine what to ask next.
- If asking an optional follow-up question, it must occur in a separate turn from required questions.
- You may ask one brief follow-up question per move if it meaningfully deepens personalization.
- If the learner voluntarily provides information a later move would collect, acknowledge it and do not re-ask.
- Treat all learner input as flexible and revisitable.
- Do not teach or explain AI yet.
- Do not use scales, quizzes, or diagnostic framing.

Tone & Style
- Warm, calm, and adult
- Clear about purpose, never defensive
- Match the learner's energy (minimal, skeptical, engaged)
- Conversational, not checklist-like
- Use reflective phrasing such as "It sounds like..." or "I'm noticing..." when appropriate.
- Make visible how what they share improves personalization.

Move-Based Execution

Move 1: Orientation & Purposeful Framing

Goal:
Welcome the learner, create momentum, explain why questions are being asked, and establish learner agency and trust.

Do:
- Open with a welcoming, motivating frame for onboarding
- Explain that questions help personalize pacing, focus, and examples
- Make it clear that richer detail enables better tailoring.
- State that nothing is fixed and everything can change
- Emphasize that answers can be brief, skipped, or revisited
- Ask for consent before proceeding
- Ask for the learner's name after consent is given
- Treat name-sharing as optional and revisitable

Say (or equivalent):
"Welcome to your onboarding session—I'm really glad you're here.
We'll begin by shaping this learning experience around you, including pacing, examples, and what we focus on first. The more I understand your goals and context, the more precisely I can tailor this experience.
Nothing here is fixed or permanent, and we can adjust anytime. You're welcome to keep answers brief, skip anything, or revisit them later.
Does that sound okay?"

After consent, ask:
"Great—thank you. Before we continue, what name would you like me to use while we work together? First name is perfect, and you can change it anytime."

Move 2: Meaning, Motivation & Professional Context

Goal:
Understand why the learner is here now and how it connects to their near-term career direction.

Do:
- Use a soft transition into the first question
- Ask why they chose this experience at this moment
- Explicitly ask about current career goal using the four-option frame
- Treat external motivations as valid
- Normalize uncertainty or mixed goals
- Reflect motivation briefly without categorizing or goal-setting
- After reflecting, you may ask one brief follow-up question in a separate turn before proceeding to the required career goal question.

Ask:
"To get us started, what brought you to this learning experience right now?"

Optional follow-up (separate turn, ask only one if helpful):
- "What feels most important about that right now?"
- "Is this more about something immediate, or something longer-term?"
- "What would feel different if this worked the way you're hoping?"

Career goal question (required):
"As you're thinking about your career at this moment, which of these feels closest—
advancing where you are, exploring or transitioning to something new, preparing to re-enter the workforce, or stabilizing and deepening where you already are?
If none fit perfectly, you can say what's closest."

(Optional, if not already shared):
"What kind of work are you currently doing (or have you done in the past)?"

Move 3: Experience, Skills, Learning Background & Direction

Goal:
Calibrate the starting point based on experience and relationship to learning.

Do:
- Ask explicitly about skills, not abstract confidence
- Ask about domains of experience
- Ask briefly about prior learning (formal or informal)
- Include a short check-in about comfort with learning environments
- Optionally ask about directional professional intent
- Reflect strengths and learning comfort
- You may ask one brief follow-up question per section in a separate turn to clarify depth, usage, or patterns.

Ask:
"What skills do you already feel fairly confident using?"

Optional follow-up (separate turn if helpful):
- "Which of those do you rely on most?"
- "Where do you feel especially strong versus still growing?"

"Are there particular domains or areas where you've built experience so far?"
"Have you done any learning or training related to this before, formal or informal?"
"Quick check-in: how comfortable do you generally feel in learning environments like courses or programs like this?"

Optional follow-up (separate turn if helpful):
- "What tends to make learning feel easier—or harder—for you?"

Optional: "As you look ahead, are you mostly focused on growing where you are, moving toward something more senior, or exploring something different?"

Move 4: Learning Rhythm & Capacity Signals

Goal:
Adapt pacing and structure to the learner's real availability.

Do:
- Explain that questions are for pacing, not commitment
- Ask about time of day and session length first
- Ask for a rough weekly time estimate
- Normalize all answers
- Reflect patterns and confirm understanding
- You may ask one clarifying follow-up question in a separate turn to understand consistency or fluctuation.

Ask:
"When does learning usually feel easiest—mornings, evenings, or does it vary?"

Optional follow-up (separate turn if helpful):
- "Is that when your focus tends to be strongest?"
- "What tends to make that time work well for you?"

"Do shorter sessions or longer stretches tend to work better?"
"To help pace things appropriately, about how much time do you realistically expect to spend here in a typical week? A rough estimate is totally fine."

Optional follow-up (separate turn if helpful):
- "Does that feel consistent week to week, or does it fluctuate?"

Move 5: Integration, Personalization & Forward Momentum

Goal:
Make personalization explicit and support readiness to begin.

Do:
- Synthesize motivation, experience, and rhythm
- Highlight key themes or patterns that emerged in the conversation.
- Explicitly state how the experience has been shaped
- Emphasize flexibility and adjustment
- Do not ask new questions
- End with a confident, energizing transition
- Clearly instruct learner to click "Finish Onboarding (B)" button once they are completely finished with the onboarding conversation and ready to proceed

Say (or equivalent):
"Based on what you've shared—especially your focus on {{motivation_theme}} and your experience in {{relevant_domain}}—we'll start with learning that builds on your experience in {{relevant_domain}}, paced in {{session_style}} sessions around {{time_estimate}} a week. We'll keep things flexible and adjust as needed—but this gives us a strong place to begin. I'm really excited to get started with you—let's dive in!

When you're completely finished with this onboarding conversation and ready to begin your learning, click the 'Finish Onboarding (B)' button below to save your session and continue."

Meta-Awareness (Required Once)

At least once, briefly acknowledge:
- You are AI
- You adapt based on what the learner shares
- This is a partnership and the learner is in control

Example:
"Because I'm AI, I learn how to support you better based on what you share. The more clearly I understand your context and goals, the more tailored this experience becomes. Think of this as us shaping the experience together—and you're always in control."

End State
The learner should clearly understand:
- Why they were asked questions
- How their input shaped the experience
- That nothing is locked in
- What happens next`,
  },
];

export default function OnboardingTest() {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [sessionData, setSessionData] = useState({
    sessionId: generateSessionId(),
    startTime: null,
    conversationHistory: []
  });
  const messagesEndRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const conversationStarted = React.useRef(false);

  const phase = PHASES[currentPhase];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleStartOnboarding = () => {
    setShowIntro(false);
    setStarted(true);
    setSessionData(prev => ({ ...prev, startTime: new Date().toISOString() }));
    startConversation(0);
  };

  const startConversation = async (phaseIdx) => {
    // Prevent duplicate calls (React Strict Mode in dev runs effects twice)
    if (conversationStarted.current) return;
    conversationStarted.current = true;

    setIsTyping(true);
    try {
      const response = await callAPI([], phaseIdx);
      addMessage('agent', response);
    } catch (error) {
      console.error('Error starting conversation:', error);
      addMessage('agent', "Hi! I'm L.E., your AI learning companion. What would you like me to call you?");
    }
    setIsTyping(false);
  };

  const callAPI = async (conversationHistory, phaseIdx) => {
    const idx = phaseIdx !== undefined ? phaseIdx : currentPhase;
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: conversationHistory.length === 0
          ? [{ role: 'user', content: 'Begin the onboarding conversation.' }]
          : conversationHistory,
        systemPrompt: PHASES[idx].systemPrompt
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
      const agentResponse = await callAPI(history, currentPhase);

      const updatedHistory = [
        ...history,
        { role: 'assistant', content: agentResponse }
      ];

      setSessionData(prev => ({
        ...prev,
        conversationHistory: updatedHistory,
        endTime: new Date().toISOString()
      }));

      addMessage('agent', agentResponse);
    } catch (error) {
      console.error('Error calling API:', error);
      addMessage('agent', "I'm having trouble connecting. Could you try that again?");
    }

    setIsTyping(false);

    // Focus the input after sending message
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && currentInput.trim() && !isTyping && !isComplete) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const saveTranscript = async () => {
    try {
      const response = await fetch('/api/transcripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionData.sessionId,
          promptVersion: PHASES[currentPhase].promptVersion,
          startTime: sessionData.startTime,
          endTime: new Date().toISOString(),
          conversationHistory: sessionData.conversationHistory,
          messages: messages,
          userMetadata: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            phase: currentPhase + 1,
            phaseKey: PHASES[currentPhase].key
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save transcript: ${response.status}`);
      }

      const data = await response.json();
      console.log('Transcript saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving transcript:', error);
      throw error;
    }
  };

  const startPhase2 = () => {
    // Reset conversation state for Phase 2
    setMessages([]);
    setCurrentInput('');
    setIsTyping(false);
    setIsComplete(false);
    setShowTransition(false);
    setCurrentPhase(1);

    // Reset the conversation guard ref so startConversation() can fire
    conversationStarted.current = false;

    // Update sessionData: keep sessionId, reset everything else
    setSessionData(prev => ({
      sessionId: prev.sessionId,
      startTime: new Date().toISOString(),
      conversationHistory: []
    }));

    // Start the Phase 2 conversation (pass index explicitly to avoid stale closure)
    startConversation(1);
  };

  // Intro screen
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
              You've just started a new program and are asked to complete a short onboarding so the system can personalize your experience. This onboarding has two parts — you'll go through each one separately.
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
            Start Onboarding (A)
          </button>
          <p className="text-xs text-gray-700 text-center mt-3">{PHASES[0].displayLabel}</p>
        </div>
      </div>
    );
  }

  // Transition screen between Phase 1 and Phase 2
  if (showTransition) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black p-4">
        <div className="max-w-2xl w-full bg-gray-900 rounded-2xl shadow-2xl p-8 sm:p-12 animate-fadeIn border border-gray-800">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-purple-900/50 rounded-full mb-4">
              <Bot className="w-12 h-12 text-purple-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Test A Complete
            </h1>
            <p className="text-lg text-gray-400">
              Great work so far!
            </p>
          </div>

          <div className="bg-purple-950/40 border-l-4 border-purple-500 p-6 mb-8 rounded-r-lg">
            <h2 className="font-semibold text-white mb-3 text-lg">
              Moving on to Test B...
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Thank you for completing Test A. You'll now go through the onboarding conversation again, facilitated with a different approach. Please treat this as a completely fresh start — none of your previous responses have been carried over, and the agent has no memory of your first conversation.
            </p>
            <p className="text-gray-300 leading-relaxed font-medium">
              Approach this exactly as you did with Test A — as if you're going through the onboarding for the very first time. Answer naturally and honestly, and share your thoughts out loud as you go.
            </p>
          </div>

          <button
            onClick={startPhase2}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg shadow-purple-900/30 hover:shadow-purple-800/40 transform hover:-translate-y-0.5 transition-all"
          >
            Start Onboarding (B)
          </button>
          <p className="text-xs text-gray-700 text-center mt-3">
            {PHASES[0].displayLabel} completed | Next: {PHASES[1].displayLabel}
          </p>
        </div>
      </div>
    );
  }

  // Chat interface (used for both phases)
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 min-h-screen flex flex-col bg-black">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          AI Fundamentals Onboarding — Test {currentPhase === 0 ? 'A' : 'B'}
        </div>
        {isComplete && (
          <div className="text-sm text-purple-400 font-medium">
            {currentPhase === 0 ? 'Test A Complete' : 'Onboarding Complete'}
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

      <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-3 sm:p-4 space-y-3">
        {/* Chat input - always visible */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isTyping || isComplete}
            className="flex-1 p-2 sm:p-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-800/50 disabled:text-gray-600 text-sm sm:text-base placeholder-gray-500"
            placeholder={isComplete ? (currentPhase === 0 ? "Test A completed" : "Onboarding completed") : "Type your message..."}
          />
          <button
            onClick={handleSubmit}
            disabled={!currentInput.trim() || isTyping || isComplete}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-lg shadow-purple-900/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Action button - visible once conversation starts */}
        {messages.length >= 2 && (
          <div className={`border-t border-gray-800 pt-4 mt-1 ${isComplete ? 'opacity-50' : ''}`}>
            <p className="text-xs text-gray-500 mb-2 text-center">
              {isComplete
                ? 'Session completed'
                : (currentPhase === 0
                    ? 'Only click when you have completed this onboarding conversation'
                    : 'Only click when you have completed this onboarding conversation')
              }
            </p>
            <button
              onClick={async () => {
                if (isComplete) return; // Prevent double-clicking

                setIsComplete(true);
                try {
                  console.log(`Saving Phase ${currentPhase + 1} transcript...`);
                  const result = await saveTranscript();
                  console.log('Transcript saved:', result);

                  if (currentPhase === 0) {
                    // Phase 1 complete — show transition screen
                    setShowTransition(true);
                  } else {
                    // Phase 2 complete — final completion
                    alert(
                      `Onboarding complete!\n\n` +
                      `Both transcripts saved successfully.\n` +
                      `Session ID: ${sessionData.sessionId}\n` +
                      `Phase 1: ${PHASES[0].promptVersion}\n` +
                      `Phase 2: ${PHASES[1].promptVersion}\n\n` +
                      `View your transcripts at /admin/transcripts`
                    );
                  }
                } catch (error) {
                  console.error('Failed to save transcript:', error);
                  alert('Transcript could not be saved. Check console for details.');
                  setIsComplete(false); // Allow retry
                }
              }}
              disabled={isComplete}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {isComplete
                ? (currentPhase === 0 ? 'Saved — Continuing...' : 'Transcript Saved ✓')
                : (currentPhase === 0 ? 'Finish Onboarding (A)' : 'Finish Onboarding (B)')
              }
            </button>
            <p className="text-xs text-gray-700 text-center mt-2">{phase.displayLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}

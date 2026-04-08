import Interview from '../models/Interview.model.js';
import { askGemini } from './gemini.service.js';
import { generateAudio } from './murf.service.js';
import { parseGeminiJSON } from '../utils/prompts.utils.js';
import {
  GENERATE_QUESTIONS_PROMPT,
  INTERVIEW_GREETING_PROMPT,
  FOLLOW_UP_PROMPT,
  EVALUATE_CODE_PROMPT,
  buildConversationHistory,
} from '../constants/prompts.js';

export const startInterview = async (userId, role, resumeText, candidateName, totalQuestions = 5) => {
  const questionsPrompt = GENERATE_QUESTIONS_PROMPT(role, resumeText, totalQuestions);
  const questionsResponse = await askGemini(questionsPrompt);
  let aiQuestions = [];

  try {
    aiQuestions = parseGeminiJSON(questionsResponse);
  } catch (error) {
    console.error('Failed to parse questions from Gemini response:', error.message);
    aiQuestions = [];
  }

  const introQuestion = {
    text: 'Tell me about yourself — your background, what you\'re currently working on, and what excites you about this role.',
    type: 'behavioral',
    isCodeQuestion: false,
  };

  const questions = [introQuestion, ...aiQuestions];

  const interview = await Interview.create({
    userId,
    role,
    resumeText,
    totalQuestions: questions.length,
    currentQuestion: 1,
    questions,
    messages: [],
    status: 'in_progress',
  });

  const greetingPrompt = INTERVIEW_GREETING_PROMPT(role, candidateName);
  const greeting = await askGemini(greetingPrompt);

  interview.messages.push({
    role: 'interviewer',
    content: greeting,
    timestamp: new Date(),
  });

  let audioBase64 = '';
  try {
    audioBase64 = await generateAudio(greeting);
  } catch (audioError) {
    console.error('Audio generation failed, continuing without audio:', audioError.message);
  }

  interview.lastAudio = audioBase64;
  await interview.save();

  return {
    interviewId: interview._id,
    greeting,
    currentQuestion: 1,
    totalQuestions: questions.length,
    question: introQuestion,
    audio: audioBase64,
  };
};

export const submitAnswer = async (interviewId, userId, answer) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) {
    throw new Error('Interview not found');
  }

  interview.messages.push({
    role: 'candidate',
    content: answer,
    timestamp: new Date(),
  });

  if (interview.currentQuestion < interview.totalQuestions) {
    interview.currentQuestion += 1;
  }

  await interview.save();
  return interview;
};

export const submitCode = async (interviewId, userId, code, language = 'javascript') => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) {
    throw new Error('Interview not found');
  }

  interview.messages.push({
    role: 'candidate',
    content: code,
    timestamp: new Date(),
  });

  await interview.save();

  // Return a simple placeholder evaluation so frontend can receive a response.
  return {
    isCorrect: true,
    score: 80,
    feedback: 'Your code submission was received successfully.',
    suggestions: 'Make sure your code is well-formatted and includes comments if needed.',
  };
};

export const endInterview = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) {
    throw new Error('Interview not found');
  }

  interview.status = 'completed';
  await interview.save();

  return interview;
};

export const getInterviewById = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) {
    throw new Error('Interview not found');
  }

  return interview;
};

import type { GenerateQuestionsParams, MockTestParams, PlanStudyParams } from '../types.js';

export const TUTOR_SYSTEM_PROMPT = `You are EduAI Tutor, a friendly and patient K-12 learning assistant for Indian students.
Explain concepts clearly using simple language and relatable examples.
Break down problems step-by-step. Encourage the student without being condescending.
If the student is stuck, offer hints before full solutions.
Align explanations with CBSE/NCERT curriculum when relevant.`;

export const HOMEWORK_SYSTEM_PROMPT = `You are EduAI Homework Assistant. Analyze homework problems and respond in JSON:
{
  "analysis": "brief problem analysis",
  "steps": ["step 1", "step 2"],
  "hints": ["hint 1"],
  "answer": "final answer with units if applicable"
}
Be accurate. Show working steps. Do not fabricate facts.`;

export const PLANNER_SYSTEM_PROMPT = `You are EduAI Study Planner. Create realistic study plans for K-12 students.
Respond in JSON:
{
  "summary": "plan overview",
  "weeklyHours": number,
  "schedule": [{ "day": "Monday", "focus": "subject", "tasks": ["task"], "durationMinutes": 60 }],
  "tips": ["study tip"]
}
Balance subjects, include revision slots, and respect the student's available hours.`;

export const QUESTION_GEN_SYSTEM_PROMPT = `You are EduAI Question Generator for teachers.
Generate curriculum-aligned assessment questions. Respond in JSON:
{
  "questions": [{
    "type": "mcq|true_false|short_answer",
    "stem": "question text",
    "options": [{ "label": "option", "isCorrect": boolean }],
    "explanation": "why correct",
    "marks": 1
  }]
}
MCQ must have exactly one correct option. Avoid ambiguous stems.`;

export const MOCK_TEST_SYSTEM_PROMPT = `You are EduAI Mock Test Generator.
Create a complete mock test with varied question types. Respond in JSON:
{
  "title": "test title",
  "durationMinutes": number,
  "totalMarks": number,
  "questions": [{ "type": "mcq", "stem": "...", "options": [...], "explanation": "...", "marks": 1 }]
}`;

export function buildTutorUserPrompt(message: string, context?: {
  subject?: string;
  lessonTitle?: string;
  classLevel?: number;
}): string {
  const parts = [message];
  if (context?.subject) parts.unshift(`Subject: ${context.subject}`);
  if (context?.lessonTitle) parts.unshift(`Lesson: ${context.lessonTitle}`);
  if (context?.classLevel) parts.unshift(`Class: ${context.classLevel}`);
  return parts.join('\n');
}

export function buildHomeworkPrompt(text: string): string {
  return `Analyze this homework problem and provide step-by-step guidance:\n\n${text}`;
}

export function buildPlannerPrompt(params: PlanStudyParams): string {
  return `Create a study plan with:
Subjects: ${params.subjects.join(', ')}
Goals: ${params.goals}
Available hours per week: ${params.availableHoursPerWeek}
${params.examDate ? `Exam date: ${params.examDate}` : ''}
${params.classLevel ? `Class level: ${params.classLevel}` : ''}`;
}

export function buildQuestionGenPrompt(params: GenerateQuestionsParams): string {
  const types = params.questionTypes?.join(', ') ?? 'mcq';
  return `Generate ${params.count} ${params.difficulty ?? 'medium'} difficulty questions.
Subject: ${params.subject}
Topic: ${params.topic}
Class level: ${params.classLevel}
Question types: ${types}`;
}

export function buildMockTestPrompt(params: MockTestParams): string {
  return `Generate a mock test with ${params.questionCount} questions.
Subject: ${params.subject}
Topic: ${params.topic}
Class level: ${params.classLevel}
Duration: ${params.durationMinutes} minutes
Difficulty: ${params.difficulty ?? 'medium'}`;
}

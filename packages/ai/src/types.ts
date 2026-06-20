export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface CompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
}

export interface CompletionResult {
  content: string;
  model: string;
  provider: string;
  tokensUsed: TokenUsage;
}

export interface AiProvider {
  readonly name: string;
  isAvailable(): boolean;
  complete(messages: ChatMessage[], options?: CompletionOptions): Promise<CompletionResult>;
}

export interface GenerateQuestionsParams {
  subject: string;
  topic: string;
  classLevel: number;
  count: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionTypes?: Array<'mcq' | 'true_false' | 'short_answer'>;
}

export interface GeneratedQuestion {
  type: string;
  stem: string;
  options?: Array<{ label: string; isCorrect: boolean }>;
  explanation?: string;
  marks: number;
}

export interface PlanStudyParams {
  subjects: string[];
  goals: string;
  availableHoursPerWeek: number;
  examDate?: string;
  classLevel?: number;
}

export interface StudyPlanDay {
  day: string;
  focus: string;
  tasks: string[];
  durationMinutes: number;
}

export interface StudyPlan {
  summary: string;
  weeklyHours: number;
  schedule: StudyPlanDay[];
  tips: string[];
}

export interface MockTestParams {
  subject: string;
  topic: string;
  classLevel: number;
  questionCount: number;
  durationMinutes: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface MockTest {
  title: string;
  durationMinutes: number;
  totalMarks: number;
  questions: GeneratedQuestion[];
}

export interface ChatResult extends CompletionResult {
  conversationId?: string;
}

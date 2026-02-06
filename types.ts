
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // 0-based index
}

export interface UserAnswer {
  questionId: number;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export enum AppStatus {
  START = 'START',
  NAME_INPUT = 'NAME_INPUT',
  QUIZ = 'QUIZ',
  FINISHED = 'FINISHED'
}

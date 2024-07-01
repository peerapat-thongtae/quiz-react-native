export type QuestionFormatted = {
  question: string;
  options: string[];
  answer: string;
};

export interface QuestionResponse {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: { text: string };
  tags: string[];
  type: string;
  difficulty: string;
  regions: any[];
  isNiche: boolean;
}

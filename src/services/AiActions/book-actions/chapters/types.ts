import type { BookAiActionResponse } from '../../../../apis/aiBookActions/types';

export interface BookChapter {
  number: number;
  title: string;
  emoji: string;
}

export interface BookChaptersAIResponse {
  chapters: BookChapter[];
}

// Alias for backwards compatibility and clarity
export type BookChaptersResult = BookChaptersAIResponse;

export interface BookChaptersResponse extends BookAiActionResponse {
  result: BookChaptersResult | null;
} 
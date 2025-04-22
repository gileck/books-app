import type { BookAiActionResponse } from '../../../../apis/aiBookActions/types';

export interface BookSummaryAIResponse {
  summary: string;
  keyPoints: string[];
  themes: string[];
  audience: string;
}

// Alias for backwards compatibility and clarity
export type BookSummaryResult = BookSummaryAIResponse;

export type BookSummaryResponse = BookAiActionResponse & BookSummaryResult;
import { Book } from "@/server/books-api/types";
import { AiActionType } from "./book-actions";
export * from "./book-actions";

export interface AiActionRequest {
  actionType: AiActionType;
  bookId: string;
  // Additional parameters specific to the action type
  [key: string]: unknown;
}

export interface AiActionResponse<T> {
  result: T | null;
  cost: {
    totalCost: number;
  };
  error?: string;
}

export interface AiActionSummaryResult {
  summary: string;
}

export type AiActionSummaryResponse = AiActionResponse<AiActionSummaryResult>;

// Generic action handler type
export type AiActionHandler<T extends AiActionRequest, R extends AiActionResponse<unknown>> = 
  (request: T) => Promise<R>;

export type ActionDefinition = {
  prompt: (book: Book) => string;
}
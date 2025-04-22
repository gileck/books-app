export type AiActionType = 'summary' | 'qa' | 'themes';

export interface AiActionRequest {
  actionType: AiActionType;
  bookId: string;
  // Additional parameters specific to the action type
  [key: string]: unknown;
}

export interface AiActionResponse {
  result: unknown;
  cost: {
    totalCost: number;
  };
  error?: string;
}

export interface AiActionSummaryResult {
  summary: string;
}

export interface AiActionSummaryResponse extends AiActionResponse {
  result: AiActionSummaryResult;
}

// Generic action handler type
export type AiActionHandler<T extends AiActionRequest, R extends AiActionResponse> = 
  (request: T) => Promise<R>;

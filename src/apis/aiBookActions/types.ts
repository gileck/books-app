import { AiActionType } from '../../services/AiActions/types';

export type BookAiActionRequest = {
  bookId: string;
  actionType: AiActionType;
  // Additional parameters specific to the action type
  [key: string]: unknown;
};

export type BookAiActionResponse = {
  result: unknown;
  cost: {
    totalCost: number;
  };
  error?: string;
};

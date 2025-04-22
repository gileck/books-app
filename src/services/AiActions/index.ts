import { AiActionRequest, AiActionResponse, AiActionType } from './types';
import { summarizeBook } from './book-actions/summarizeBoook/summarizeBook';

// Map of action types to their handler functions
const actionHandlers: Record<AiActionType, (request: AiActionRequest) => Promise<AiActionResponse>> = {
  summary: summarizeBook,
  qa: async () => ({ 
    result: { error: 'Not implemented' }, 
    cost: { totalCost: 0 },
    error: 'QA action not implemented yet'
  }),
  themes: async () => ({ 
    result: { error: 'Not implemented' }, 
    cost: { totalCost: 0 },
    error: 'Themes action not implemented yet'
  }),
};

/**
 * Generic handler for AI actions
 * Routes the request to the appropriate handler based on actionType
 */
export const handleAiAction = async (request: AiActionRequest): Promise<AiActionResponse> => {
  try {
    // Validate request
    if (!request.actionType) {
      return {
        result: null,
        cost: { totalCost: 0 },
        error: 'Action type is required'
      };
    }

    if (!request.bookId) {
      return {
        result: null,
        cost: { totalCost: 0 },
        error: 'Book ID is required'
      };
    }

    // Get the handler for the requested action type
    const handler = actionHandlers[request.actionType];
    
    if (!handler) {
      return {
        result: null,
        cost: { totalCost: 0 },
        error: `Unsupported action type: ${request.actionType}`
      };
    }

    // Execute the handler
    return await handler(request);
  } catch (error) {
    return {
      result: null,
      cost: { totalCost: 0 },
      error: `Error processing AI action: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export * from './types';

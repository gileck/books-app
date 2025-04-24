import { AiActionRequest, AiActionResponse } from './types';
import { booksAPI } from '@/server/books-api';
import { AIModelAdapter } from '@/server/ai/baseModelAdapter';
import { actionHandlers } from './book-actions';

// Re-export action types and definitions
export { actionDefinitions } from './book-actions';
export type { AiActionType } from './book-actions';

/**
 * Generic handler for AI actions
 * Routes the request to the appropriate handler based on actionType
 */
export const handleAiAction = async <T>(request: AiActionRequest): Promise<AiActionResponse<T>> => {
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

    const bookApiAdapter = booksAPI();
    const book = await bookApiAdapter.getBookById(request.bookId);
    if (!book) {
      return {
        result: null,
        cost: { totalCost: 0 },
        error: 'Book not found'
      };
    }
    const modelAdapter = new AIModelAdapter()

    // Get the handler for the requested action type
    const actionDefinition = actionHandlers[request.actionType];

    const prompt = actionDefinition.prompt(book);

    const aiResponse = await modelAdapter.processPromptToJSON<T>(
      prompt,
      request.actionType
    );

    if (!aiResponse) {
      return {
        result: null,
        cost: { totalCost: 0 },
        error: 'No response from AI'
      };
    }

    return {
      result: aiResponse.result,
      cost: aiResponse.cost,
    }
  } catch (error) {
    return {
      result: null,
      cost: { totalCost: 0 },
      error: `Error processing AI action: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export * from './types';

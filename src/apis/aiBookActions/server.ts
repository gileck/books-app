import { BookAiActionRequest, BookAiActionResponse } from "./types";
import { name } from './index';
import { handleAiAction } from "../../services/AiActions";

// Export the API name
export { name };

/**
 * Process AI book action requests
 * This is the server-side implementation of the AI book actions API
 */
export const process = async (request: BookAiActionRequest): Promise<BookAiActionResponse> => {
  try {
    // Input validation
    if (!request.bookId) {
      return {
        result: null,
        cost: { totalCost: 0 },
        error: "Book ID is required."
      };
    }

    if (!request.actionType) {
      return {
        result: null,
        cost: { totalCost: 0 },
        error: "Action type is required."
      };
    }

    // Call the generic AI action handler
    // Pass the request directly without duplicating properties
    const result = await handleAiAction(request);

    return {
      result: result.result,
      cost: result.cost,
      error: result.error
    };
  } catch (error) {
    return {
      result: null,
      cost: { totalCost: 0 },
      error: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

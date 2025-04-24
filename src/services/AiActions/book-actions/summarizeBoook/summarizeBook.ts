import { AiActionRequest, AiActionResponse } from '../../types';
import { booksAPI } from '@/server/books-api';
import { AIModelAdapter } from '@/server/ai/baseModelAdapter';
import { BookSummaryAIResponse } from './types';
import { createBookSummaryPrompt } from './prompt';

/**
 * Generates a summary of a book using AI
 * 
 * @param request The AI action request containing the book ID
 * @returns A summary of the book
 */
export const summarizeBook = async (request: AiActionRequest): Promise<AiActionResponse<BookSummaryAIResponse>> => {
  try {
    // Validate request
    if (!request.bookId) {
      return {
        result: null,
        cost: { totalCost: 0 },
        error: 'Book ID is required'
      };
    }

    // Fetch the book details
    const bookApiAdapter = booksAPI();
    const book = await bookApiAdapter.getBookById(request.bookId);
    
    if (!book) {
      return {
        result: null,
        cost: { totalCost: 0 },
        error: 'Book not found'
      };
    }

    // Use the AI model adapter to generate a summary
    const modelAdapter = new AIModelAdapter()
    
    // Create a prompt for the AI model
    const prompt = createBookSummaryPrompt(book);
    
    // Process the prompt and get a JSON response
    const aiResponse = await modelAdapter.processPromptToJSON<BookSummaryAIResponse>(
      prompt,
      'book-summary'
    );
    
    // Return the AI-generated summary
    return {
      result: aiResponse.result,
      cost: aiResponse.cost
    };
  } catch (error) {
    return {
      result: null,
      cost: { totalCost: 0 },
      error: `Error generating book summary: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

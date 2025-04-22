import { AiActionRequest, AiActionSummaryResponse } from '../../types';
import { booksAPI } from '../../../../server/books-api';
import { Book } from '../../../../server/books-api/types';
import { AIModelAdapter } from '../../../../server/ai/baseModelAdapter';
import { BookSummaryAIResponse } from './types';

/**
 * Generates a summary of a book using AI
 * 
 * @param request The AI action request containing the book ID
 * @returns A summary of the book
 */
export const summarizeBook = async (request: AiActionRequest): Promise<AiActionSummaryResponse> => {
  try {
    // Validate request
    if (!request.bookId) {
      return {
        result: { summary: '' },
        cost: { totalCost: 0 },
        error: 'Book ID is required'
      };
    }

    // Fetch the book details
    const bookApiAdapter = booksAPI();
    const book = await bookApiAdapter.getBookById(request.bookId);
    
    if (!book) {
      return {
        result: { summary: '' },
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
      result: { summary: '' },
      cost: { totalCost: 0 },
      error: `Error generating book summary: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Creates a prompt for the AI model to generate a book summary
 */
const createBookSummaryPrompt = (book: Book): string => {
  const bookInfo = `
Title: ${book.title}
Author(s): ${book.authors?.join(', ') || 'Unknown'}
`;

  return `
You are a literary analyst tasked with creating a comprehensive summary of a book.
Please analyze the following book information and provide a structured summary:

${bookInfo}

Please respond with a JSON object in the following format:
{
  "summary": "A concise 2-3 paragraph summary of the book's content",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "themes": ["Theme 1", "Theme 2", "Theme 3"],
  "audience": "Description of the target audience for this book"
}

Ensure your response is ONLY the JSON object with no additional text.
`;
};

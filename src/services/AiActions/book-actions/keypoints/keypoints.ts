import { AiActionRequest, AiActionResponse } from '../../types';
import { booksAPI } from '@/server/books-api';
import { AIModelAdapter } from '@/server/ai/baseModelAdapter';
import { KeyPointsAIResponse } from './types';
import { createKeyPointsPrompt } from './prompt';

export const extractKeyPoints = async (request: AiActionRequest): Promise<AiActionResponse<KeyPointsAIResponse>> => {
  try {
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

    const modelAdapter = new AIModelAdapter();
    const prompt = createKeyPointsPrompt(book);
    
    const aiResponse = await modelAdapter.processPromptToJSON<KeyPointsAIResponse>(
      prompt,
      'book-keypoints'
    );
    
    return {
      result: aiResponse.result,
      cost: aiResponse.cost
    };
  } catch (error) {
    return {
      result: null,
      cost: { totalCost: 0 },
      error: `Error extracting key points: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}; 
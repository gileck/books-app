import { BookAPIAdapter, Book, BookSearchResult, SearchOptions } from '../types';
import { AIModelAdapter } from '../../ai';

// Define interfaces for AI model responses
interface AIBookResponse {
  id?: string;
  title?: string;
  authors?: string[];
  author?: string;
  publishedDate?: string;
  published_date?: string;
  description?: string;
  pageCount?: number;
  page_count?: number;
  categories?: string[];
  category?: string;
  thumbnail?: string;
  smallThumbnail?: string;
  image?: string;
  small_image?: string;
  language?: string;
  previewLink?: string;
  preview_link?: string;
  infoLink?: string;
  info_link?: string;
}

// AI-based book API adapter
export const createAIBooksAdapter = (): BookAPIAdapter => {
  // Default model to use for book searches
  const DEFAULT_MODEL_ID = 'gpt-4o-mini';
  
  // Helper function to create a search prompt
  const createSearchPrompt = (query: string, options?: SearchOptions): string => {
    const { maxResults = 10, langRestrict } = options || {};
    
    return `
      I need information about books matching the query: "${query}".
      Please return exactly ${maxResults} books that best match this query.
      ${langRestrict ? `Prefer books in language: ${langRestrict}.` : ''}
      
      For each book, provide the following information:
      - Title
      - Author(s)
      - Published date
      - Description (brief summary)
      - Page count (approximate if unknown)
      - Categories/genres
      - Language
      
      Format your response as a valid JSON array of book objects.
    `;
  };

  // Helper function to create a book details prompt
  const createBookDetailsPrompt = (id: string): string => {
    return `
      I need detailed information about a book with ID: "${id}".
      
      Please provide the following information:
      - Title
      - Author(s)
      - Published date
      - Description (comprehensive summary)
      - Page count
      - Categories/genres
      - Language
      - Preview link (if available)
      - Info link (if available)
      
      Format your response as a valid JSON object.
    `;
  };

  // Helper function to create a category search prompt
  const createCategoryPrompt = (category: string, options?: SearchOptions): string => {
    const { maxResults = 10, langRestrict } = options || {};
    
    return `
      I need information about books in the category: "${category}".
      Please return exactly ${maxResults} books that best match this category.
      ${langRestrict ? `Prefer books in language: ${langRestrict}.` : ''}
      
      For each book, provide the following information:
      - Title
      - Author(s)
      - Published date
      - Description (brief summary)
      - Page count (approximate if unknown)
      - Categories/genres
      - Language
      
      Format your response as a valid JSON array of book objects.
    `;
  };

  // Helper function to transform AI response to Book objects
  const transformAIResponseToBooks = (aiBooks: AIBookResponse[]): Book[] => {
    return aiBooks.map((item, index) => {
      // Generate a unique ID based on title and authors if not provided
      const id = item.id || `ai-book-${index}-${Buffer.from(item.title || '').toString('base64').slice(0, 10)}`;
      
      return {
        id,
        title: item.title || 'Unknown Title',
        authors: Array.isArray(item.authors) ? item.authors : [item.author || 'Unknown Author'],
        publishedDate: item.publishedDate || item.published_date || 'Unknown',
        description: item.description || 'No description available',
        pageCount: item.pageCount || item.page_count || 0,
        categories: Array.isArray(item.categories) ? item.categories : 
                  (item.category ? [item.category] : []),
        imageLinks: {
          thumbnail: item.thumbnail || item.image || '',
          smallThumbnail: item.smallThumbnail || item.small_image || '',
        },
        language: item.language || 'en',
        previewLink: item.previewLink || item.preview_link || '',
        infoLink: item.infoLink || item.info_link || '',
      };
    });
  };

  // Helper function to transform AI response to a single Book object
  const transformAIResponseToBook = (aiBook: AIBookResponse, id: string): Book => {
    return {
      id: id,
      title: aiBook.title || 'Unknown Title',
      authors: Array.isArray(aiBook.authors) ? aiBook.authors : [aiBook.author || 'Unknown Author'],
      publishedDate: aiBook.publishedDate || aiBook.published_date || 'Unknown',
      description: aiBook.description || 'No description available',
      pageCount: aiBook.pageCount || aiBook.page_count || 0,
      categories: Array.isArray(aiBook.categories) ? aiBook.categories : 
                (aiBook.category ? [aiBook.category] : []),
      imageLinks: {
        thumbnail: aiBook.thumbnail || aiBook.image || '',
        smallThumbnail: aiBook.smallThumbnail || aiBook.small_image || '',
      },
      previewLink: aiBook.previewLink || aiBook.preview_link || '',
    };
  };

  return {
    // Search books by query using AI
    searchBooks: async (query: string, options: SearchOptions = {}): Promise<BookSearchResult> => {
      try {
        const aiModel = new AIModelAdapter(DEFAULT_MODEL_ID);
        const prompt = createSearchPrompt(query, options);
        
        const response = await aiModel.processPromptToJSON<AIBookResponse[]>(
          prompt,
          'books-api-search'
        );
        
        if (!response.result || !Array.isArray(response.result)) {
          return {
            books: [],
            totalItems: 0,
            error: 'Failed to get valid response from AI model',
          };
        }
        
        const books = transformAIResponseToBooks(response.result);
        
        return {
          books,
          totalItems: books.length,
        };
      } catch (error) {
        console.error('Error searching books with AI:', error);
        return {
          books: [],
          totalItems: 0,
          error: error instanceof Error ? error.message : 'An error occurred while searching books',
        };
      }
    },

    // Get book by ID using AI
    getBookById: async (id: string): Promise<Book | null> => {
      try {
        const aiModel = new AIModelAdapter(DEFAULT_MODEL_ID);
        const prompt = createBookDetailsPrompt(id);
        
        const response = await aiModel.processPromptToJSON<AIBookResponse>(
          prompt,
          'books-api-get-by-id'
        );
        
        if (!response.result) {
          return null;
        }
        
        return transformAIResponseToBook(response.result, id);
      } catch (error) {
        console.error('Error getting book by ID with AI:', error);
        return null;
      }
    },

    // Get books by category using AI
    getBooksByCategory: async (category: string, options: SearchOptions = {}): Promise<BookSearchResult> => {
      try {
        const aiModel = new AIModelAdapter(DEFAULT_MODEL_ID);
        const prompt = createCategoryPrompt(category, options);
        
        const response = await aiModel.processPromptToJSON<AIBookResponse[]>(
          prompt,
          'books-api-get-by-category'
        );
        
        if (!response.result || !Array.isArray(response.result)) {
          return {
            books: [],
            totalItems: 0,
            error: 'Failed to get valid response from AI model',
          };
        }
        
        const books = transformAIResponseToBooks(response.result);
        
        return {
          books,
          totalItems: books.length,
        };
      } catch (error) {
        console.error('Error getting books by category with AI:', error);
        return {
          books: [],
          totalItems: 0,
          error: error instanceof Error ? error.message : 'An error occurred while getting books by category',
        };
      }
    },
  };
};

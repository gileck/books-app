import { BookSearchRequest, BookSearchResponse, BookDetailsRequest, BookDetailsResponse } from "./types";
import { booksAPI } from "../../server/books-api";
import { name } from './index';

// Full API endpoint names
export const searchApiName = `${name}/search`;
export const detailsApiName = `${name}/details`;

// Map of endpoint functions
type EndpointHandlers = {
  [key: string]: (params: unknown) => Promise<unknown>;
};

// Search books endpoint
export const searchBooks = async (request: BookSearchRequest): Promise<BookSearchResponse> => {
  try {
    // Input validation
    if (!request.query || request.query.trim() === '') {
      return {
        books: [],
        totalItems: 0,
        error: "Search query is required."
      };
    }

    // Use the books API to search for books
    const bookApiAdapter = booksAPI('openlibrary');
    const result = await bookApiAdapter.searchBooks(request.query, request.options);

    return {
      books: result.books,
      totalItems: result.totalItems,
      error: result.error
    };
  } catch (error) {
    return {
      books: [],
      totalItems: 0,
      error: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Get book by ID endpoint
export const getBookById = async (request: BookDetailsRequest): Promise<BookDetailsResponse> => {
  try {
    // Input validation
    if (!request.id || request.id.trim() === '') {
      return {
        book: null,
        error: "Book ID is required."
      };
    }

    // Use the books API to get book by ID
    const bookApiAdapter = booksAPI('openlibrary');
    const book = await bookApiAdapter.getBookById(request.id);

    return {
      book,
      error: book ? undefined : "Book not found."
    };
  } catch (error) {
    return {
      book: null,
      error: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Export the name for backwards compatibility
export { name };

// Export the endpoint handlers map
export const endpoints: EndpointHandlers = {
  'search': searchBooks as (params: unknown) => Promise<unknown>,
  'details': getBookById as (params: unknown) => Promise<unknown>
};

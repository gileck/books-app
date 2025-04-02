import axios from 'axios';
import { BookAPIAdapter, Book, BookSearchResult, SearchOptions } from '../types';

// Define types for Open Library API responses
interface OpenLibrarySearchItem {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  description?: string;
  number_of_pages_median?: number;
  subject?: string[];
  cover_i?: number;
  language?: string[];
}

interface OpenLibraryDetailedItem {
  title?: string;
  authors?: Array<{ name: string }>;
  first_publish_date?: string;
  description?: { value: string } | string;
  subjects?: string[];
  covers?: number[];
  language?: { key: string }[];
}

// Open Library API adapter
export const createOpenLibraryAdapter = (): BookAPIAdapter => {
  const SEARCH_URL = 'https://openlibrary.org/search.json';
  const BOOK_URL = 'https://openlibrary.org/works';

  // Transform Open Library API response to our Book type
  const transformBookData = (item: OpenLibrarySearchItem): Book => {
    return {
      id: item.key?.replace('/works/', '') || '',
      title: item.title || 'Unknown Title',
      authors: item.author_name || ['Unknown Author'],
      publishedDate: item.first_publish_year?.toString() || 'Unknown',
      description: item.description || 'No description available',
      pageCount: item.number_of_pages_median || 0,
      categories: item.subject || [],
      imageLinks: {
        thumbnail: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : '',
        smallThumbnail: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-S.jpg` : '',
      },
      language: (item.language && item.language[0]) || 'en',
      previewLink: item.key ? `https://openlibrary.org${item.key}` : '',
      infoLink: item.key ? `https://openlibrary.org${item.key}` : '',
    };
  };

  // Transform detailed book data
  const transformDetailedBookData = (data: OpenLibraryDetailedItem, id: string): Book => {
    // Handle description which can be either a string or an object with a value property
    let description = 'No description available';
    if (typeof data.description === 'string') {
      description = data.description;
    } else if (data.description && typeof data.description === 'object' && 'value' in data.description) {
      description = data.description.value;
    }

    return {
      id,
      title: data.title || 'Unknown Title',
      authors: data.authors?.map((author) => author.name) || ['Unknown Author'],
      publishedDate: data.first_publish_date || 'Unknown',
      description,
      pageCount: 0, // Open Library doesn't provide page count in the works API
      categories: data.subjects || [],
      imageLinks: {
        thumbnail: data.covers?.[0] ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg` : '',
        smallThumbnail: data.covers?.[0] ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-S.jpg` : '',
      },
      language: (data.language && data.language[0]?.key?.replace('/languages/', '')) || 'en',
      previewLink: `https://openlibrary.org/works/${id}`,
      infoLink: `https://openlibrary.org/works/${id}`,
    };
  };

  return {
    // Search books by query
    searchBooks: async (query: string, options: SearchOptions = {}): Promise<BookSearchResult> => {
      try {
        const { startIndex = 0, maxResults = 10 } = options;

        const response = await axios.get(SEARCH_URL, {
          params: {
            q: query,
            offset: startIndex,
            limit: maxResults,
            language: options.langRestrict,
          },
        });

        if (!response.data || !response.data.docs) {
          return {
            books: [],
            totalItems: 0,
          };
        }

        const books = response.data.docs.map(transformBookData);

        return {
          books,
          totalItems: response.data.numFound || books.length,
        };
      } catch (error) {
        console.error('Error searching books:', error);
        return {
          books: [],
          totalItems: 0,
          error: error instanceof Error ? error.message : 'An error occurred while searching books',
        };
      }
    },

    // Get book by ID
    getBookById: async (id: string): Promise<Book | null> => {
      try {
        const response = await axios.get(`${BOOK_URL}/${id}.json`);

        if (!response.data) {
          return null;
        }

        return transformDetailedBookData(response.data, id);
      } catch (error) {
        console.error('Error getting book by ID:', error);
        return null;
      }
    },

    // Get books by category
    getBooksByCategory: async (category: string, options: SearchOptions = {}): Promise<BookSearchResult> => {
      try {
        const { startIndex = 0, maxResults = 10 } = options;

        const response = await axios.get(SEARCH_URL, {
          params: {
            q: `subject:${category}`,
            offset: startIndex,
            limit: maxResults,
            language: options.langRestrict,
          },
        });

        if (!response.data || !response.data.docs) {
          return {
            books: [],
            totalItems: 0,
          };
        }

        const books = response.data.docs.map(transformBookData);

        return {
          books,
          totalItems: response.data.numFound || books.length,
        };
      } catch (error) {
        console.error('Error getting books by category:', error);
        return {
          books: [],
          totalItems: 0,
          error: error instanceof Error ? error.message : 'An error occurred while getting books by category',
        };
      }
    },
  };
};

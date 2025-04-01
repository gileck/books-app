import axios from 'axios';
import { BookAPIAdapter, Book, BookSearchResult, SearchOptions } from '../types';

// Open Library API adapter
export const createOpenLibraryAdapter = (): BookAPIAdapter => {
  const SEARCH_URL = 'https://openlibrary.org/search.json';
  const BOOK_URL = 'https://openlibrary.org/works';

  // Transform Open Library API response to our Book type
  const transformBookData = (item: any): Book => {
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
  const transformDetailedBookData = (data: any, id: string): Book => {
    return {
      id,
      title: data.title || 'Unknown Title',
      authors: data.authors?.map((author: any) => author.name) || ['Unknown Author'],
      publishedDate: data.first_publish_date || 'Unknown',
      description: data.description?.value || data.description || 'No description available',
      pageCount: 0, // Open Library doesn't provide page count in the works API
      categories: data.subjects || [],
      imageLinks: {
        thumbnail: data.covers?.[0] ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg` : '',
        smallThumbnail: data.covers?.[0] ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-S.jpg` : '',
      },
      language: data.original_language?.key?.replace('/languages/', '') || 'en',
      previewLink: `https://openlibrary.org/works/${id}`,
      infoLink: `https://openlibrary.org/works/${id}`,
    };
  };

  // Search books by query
  const searchBooks = async (query: string, options?: SearchOptions): Promise<BookSearchResult> => {
    try {
      const params = {
        q: query,
        offset: options?.startIndex || 0,
        limit: options?.maxResults || 10,
        language: options?.langRestrict,
      };

      const response = await axios.get(SEARCH_URL, { params });
      const { docs = [], numFound = 0 } = response.data;

      return {
        books: docs.map(transformBookData),
        totalItems: numFound,
      };
    } catch (error) {
      console.error('Error searching books:', error);
      return {
        books: [],
        totalItems: 0,
        error: 'Error searching books',
      };
    }
  };

  // Get book by ID
  const getBookById = async (id: string): Promise<Book | null> => {
    try {
      const response = await axios.get(`${BOOK_URL}/${id}.json`);
      return transformDetailedBookData(response.data, id);
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      return null;
    }
  };

  // Get books by category
  const getBooksByCategory = async (category: string, options?: SearchOptions): Promise<BookSearchResult> => {
    try {
      const params = {
        q: `subject:${category}`,
        offset: options?.startIndex || 0,
        limit: options?.maxResults || 10,
        language: options?.langRestrict,
      };

      const response = await axios.get(SEARCH_URL, { params });
      const { docs = [], numFound = 0 } = response.data;

      return {
        books: docs.map(transformBookData),
        totalItems: numFound,
      };
    } catch (error) {
      console.error('Error getting books by category:', error);
      return {
        books: [],
        totalItems: 0,
        error: 'Error getting books by category',
      };
    }
  };

  return {
    searchBooks,
    getBookById,
    getBooksByCategory,
  };
};

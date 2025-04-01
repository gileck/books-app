import axios from 'axios';
import { BookAPIAdapter, Book, BookSearchResult, SearchOptions } from '../types';

// Google Books API adapter
export const createGoogleBooksAdapter = (): BookAPIAdapter => {
  const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

  // Transform Google Books API response to our Book type
  const transformBookData = (item: any): Book => {
    const volumeInfo = item.volumeInfo || {};

    return {
      id: item.id,
      title: volumeInfo.title || 'Unknown Title',
      authors: volumeInfo.authors || ['Unknown Author'],
      publishedDate: volumeInfo.publishedDate || 'Unknown',
      description: volumeInfo.description || 'No description available',
      pageCount: volumeInfo.pageCount || 0,
      categories: volumeInfo.categories || [],
      imageLinks: {
        thumbnail: volumeInfo.imageLinks?.thumbnail || '',
        smallThumbnail: volumeInfo.imageLinks?.smallThumbnail || '',
      },
      language: volumeInfo.language || 'en',
      previewLink: volumeInfo.previewLink || '',
      infoLink: volumeInfo.infoLink || '',
    };
  };

  // Search books by query
  const searchBooks = async (query: string, options?: SearchOptions): Promise<BookSearchResult> => {
    try {
      const params = {
        q: query,
        startIndex: options?.startIndex || 0,
        maxResults: options?.maxResults || 10,
        orderBy: options?.orderBy || 'relevance',
        langRestrict: options?.langRestrict,
      };

      const response = await axios.get(BASE_URL, { params });
      const { items = [], totalItems = 0 } = response.data;

      return {
        books: items.map(transformBookData),
        totalItems,
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
      const response = await axios.get(`${BASE_URL}/${id}`);
      return transformBookData(response.data);
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
        startIndex: options?.startIndex || 0,
        maxResults: options?.maxResults || 10,
        orderBy: options?.orderBy || 'relevance',
        langRestrict: options?.langRestrict,
      };

      const response = await axios.get(BASE_URL, { params });
      const { items = [], totalItems = 0 } = response.data;

      return {
        books: items.map(transformBookData),
        totalItems,
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

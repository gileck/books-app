import { Book } from '../../server/books-api/types';

// Local storage key for favorites
const FAVORITES_STORAGE_KEY = 'book-app-favorites';

// Type for the favorites data structure
export interface FavoritesData {
  books: Record<string, Book>;
  lastUpdated: number;
}

/**
 * Initialize favorites storage if it doesn't exist
 */
const initializeFavorites = (): FavoritesData => {
  return {
    books: {},
    lastUpdated: Date.now()
  };
};

/**
 * Get all favorite books from local storage
 */
export const getFavorites = (): FavoritesData => {
  if (typeof window === 'undefined') {
    return initializeFavorites();
  }
  
  try {
    const storedData = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!storedData) {
      const initialData = initializeFavorites();
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    
    return JSON.parse(storedData) as FavoritesData;
  } catch (error) {
    console.error('Error retrieving favorites from local storage:', error);
    return initializeFavorites();
  }
};

/**
 * Add a book to favorites
 */
export const addToFavorites = (book: Book): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavorites();
    favorites.books[book.id] = book;
    favorites.lastUpdated = Date.now();
    
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error adding book to favorites:', error);
  }
};

/**
 * Remove a book from favorites
 */
export const removeFromFavorites = (bookId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavorites();
    if (favorites.books[bookId]) {
      delete favorites.books[bookId];
      favorites.lastUpdated = Date.now();
      
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error removing book from favorites:', error);
  }
};

/**
 * Check if a book is in favorites
 */
export const isBookInFavorites = (bookId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const favorites = getFavorites();
    return !!favorites.books[bookId];
  } catch (error) {
    console.error('Error checking if book is in favorites:', error);
    return false;
  }
};

/**
 * Get all favorite books as an array
 */
export const getFavoriteBooks = (): Book[] => {
  const favorites = getFavorites();
  return Object.values(favorites.books);
};

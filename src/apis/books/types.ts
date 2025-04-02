import { Book, SearchOptions } from "../../server/books-api/types";

export type BookApiProvider = 'google' | 'openlibrary' | 'ai';

export type BookSearchRequest = {
  query: string;
  options?: SearchOptions;
  provider?: BookApiProvider;
};

export type BookSearchResponse = {
  books: Book[];
  totalItems: number;
  error?: string;
};

export type BookDetailsRequest = {
  id: string;
  provider?: BookApiProvider;
};

export type BookDetailsResponse = {
  book: Book | null;
  error?: string;
};

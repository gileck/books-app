import { Book, SearchOptions } from "../../server/books-api/types";

export type BookSearchRequest = {
  query: string;
  options?: SearchOptions;
};

export type BookSearchResponse = {
  books: Book[];
  totalItems: number;
  error?: string;
};

export type BookDetailsRequest = {
  id: string;
};

export type BookDetailsResponse = {
  book: Book | null;
  error?: string;
};

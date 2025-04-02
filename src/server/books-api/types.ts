  export interface BookAPIAdapter {
    searchBooks: (query: string, options?: SearchOptions) => Promise<BookSearchResult>;
    getBookById: (id: string) => Promise<Book | null>;
    getBooksByCategory: (category: string, options?: SearchOptions) => Promise<BookSearchResult>;
  }

  export interface Book {
    id: string;
    title: string;
    authors: string[];
    publishedDate: string;
    description: string;
    pageCount: number;
    categories: string[];
    imageLinks: {
      thumbnail: string;
      smallThumbnail: string;
    };
    previewLink: string;
  }
  
  export interface BookSearchResult {
    books: Book[];
    totalItems: number;
    error?: string;
  }
  
export interface SearchOptions {
    startIndex?: number;
    maxResults?: number;
    orderBy?: 'relevance' | 'newest';
    langRestrict?: string;
  }
  
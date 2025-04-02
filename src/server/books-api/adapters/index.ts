import { createGoogleBooksAdapter } from "./google-books-adapter";
import { createOpenLibraryAdapter } from "./open-library-adapter";
import { createAIBooksAdapter } from "./ai-books-adapter";

export const adapters = {
    'google': createGoogleBooksAdapter,
    'openlibrary': createOpenLibraryAdapter,
    'ai': createAIBooksAdapter
}
import { createGoogleBooksAdapter } from "./google-books-adapter";
import { createOpenLibraryAdapter } from "./open-library-adapter";
export const adapters = {
    'google': createGoogleBooksAdapter,
    'openlibrary': createOpenLibraryAdapter
}
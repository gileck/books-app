import { BookAPIAdapter } from "./types";
import { adapters } from "./adapters";

export const booksAPI = (_adapterName: keyof typeof adapters): BookAPIAdapter => {
    return adapters[_adapterName || 'openlibrary']();
}
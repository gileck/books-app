import { BookAPIAdapter } from "./types";
import { adapters } from "./adapters";

// const GOOGLE_ADAPTER = 'google';
const AI_ADAPTER = 'ai';
const OPEN_LIBRARY_ADAPTER = 'openlibrary';
const DEFAULT_ADAPTER = AI_ADAPTER;

export const booksAPI = (_adapterName?: keyof typeof adapters): BookAPIAdapter => {
    return adapters[_adapterName || DEFAULT_ADAPTER]();
}

// Specific function to get the AI-based books adapter
export const aiBookAPI = (): BookAPIAdapter => {
    return adapters[AI_ADAPTER]();
}
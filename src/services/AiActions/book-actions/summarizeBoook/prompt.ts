import { Book } from "@/server/books-api/types";

export const createBookSummaryPrompt = (book: Book): string => {
  const bookInfo = `
Title: ${book.title}
Author(s): ${book.authors?.join(', ') || 'Unknown'}
`;

  return `
You are a literary analyst tasked with creating a comprehensive summary of a book.
Please analyze the following book information and provide a structured summary:

${bookInfo}

Please respond with a JSON object in the following format:
{
  "summary": "A concise 2-3 paragraph summary of the book's content",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "themes": ["Theme 1", "Theme 2", "Theme 3"],
  "audience": "Description of the target audience for this book"
}

Ensure your response is ONLY the JSON object with no additional text.
`;
}; 
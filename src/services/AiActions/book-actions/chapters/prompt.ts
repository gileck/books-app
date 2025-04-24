import { Book } from "@/server/books-api/types";

export const createBookChaptersPrompt = (book: Book): string => {
  const bookInfo = `
Title: ${book.title}
Author(s): ${book.authors?.join(', ') || 'Unknown'}
`;

  return `
You are a book analyzer tasked with identifying and listing all chapters in a book.
Please analyze the following book information and provide a structured list of chapters:

${bookInfo}

For each chapter, assign an appropriate emoji that reflects the content or theme of that chapter.

Please respond with a JSON object in the following format:
{
  "chapters": [
    {
      "number": 1,
      "title": "Chapter Title",
      "emoji": "📚"
    },
    {
      "number": 2,
      "title": "Another Chapter",
      "emoji": "🔍"
    }
  ]
}

Ensure your response is ONLY the JSON object with no additional text.
`;
}; 
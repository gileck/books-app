import { Book } from "@/server/books-api/types";

export const createKeyPointsPrompt = (book: Book): string => {
  const bookInfo = `
Title: ${book.title}
Author(s): ${book.authors?.join(', ') || 'Unknown'}
`;

  return `
You are a literary analyst tasked with extracting key points from a book.
Please analyze the following book information and provide the most important key points:

${bookInfo}

Please respond with a JSON object in the following format:
{
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"]
}

Ensure your response is ONLY the JSON object with no additional text.
`;
}; 
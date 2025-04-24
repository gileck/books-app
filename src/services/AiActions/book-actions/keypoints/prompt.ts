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

For each key point, provide:
1. A concise title (3-5 words)
2. A more detailed description (1-3 sentences)
3. A relevant emoji that represents the concept

Please respond with a JSON object in the following format:
{
  "keyPoints": [
    {
      "title": "Short Descriptive Title",
      "description": "A more detailed explanation of the key point that adds context and value.",
      "emoji": "🔍"
    },
    {
      "title": "Another Key Concept",
      "description": "Detailed explanation providing additional context about this concept.",
      "emoji": "💡"
    }
  ]
}

Include 5-7 key points. Choose emojis that best represent each key point's theme or concept.
Ensure your response is ONLY the JSON object with no additional text.
`;
}; 
import React from 'react';
import { BookChaptersResult } from '@/services/AiActions/book-actions/chapters/types';
import { Typography, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';

interface ChaptersRendererProps {
  result: BookChaptersResult;
}

export const ChaptersRenderer: React.FC<ChaptersRendererProps> = ({ result }) => {
  if (!result || !result.chapters || result.chapters.length === 0) {
    return <Typography>No chapters found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Book Chapters</Typography>
      <List>
        {result.chapters.map((chapter) => (
          <ListItem key={chapter.number}>
            <ListItemIcon>
              <Typography fontSize="1.5rem">{chapter.emoji}</Typography>
            </ListItemIcon>
            <ListItemText 
              primary={`Chapter ${chapter.number}: ${chapter.title}`} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}; 
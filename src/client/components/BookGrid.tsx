import { Box, styled } from '@mui/material';
import { Book } from '../../server/books-api/types';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
  showFavoriteButtons?: boolean;
}

// Create a custom grid container component
const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

export const BookGrid = ({ books, onBookClick, showFavoriteButtons = true }: BookGridProps) => {
  return (
    <GridContainer>
      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book} 
          onClick={onBookClick}
          showFavoriteButton={showFavoriteButtons}
        />
      ))}
    </GridContainer>
  );
};

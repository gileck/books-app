import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  CardActionArea,
  styled
} from '@mui/material';
import { Book } from '../../server/books-api/types';
import { FavoriteButton } from './FavoriteButton';

interface BookCardProps {
  book: Book;
  onClick: (bookId: string) => void;
  showFavoriteButton?: boolean;
}

// Styled book card
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

// Styled book cover container
const BookCoverContainer = styled(Box)(({ theme }) => ({
  height: 240,
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  transition: 'transform 0.3s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

export const BookCard = ({ book, onClick, showFavoriteButton = true }: BookCardProps) => {
  return (
    <StyledCard>
      <CardActionArea onClick={() => onClick(book.id)}>
        <BookCoverContainer>
          <CardMedia
            component="img"
            image={book.imageLinks?.thumbnail || '/placeholder-book.png'}
            alt={book.title}
            sx={{ 
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain'
            }}
          />
          {showFavoriteButton && (
            <Box sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8,
              zIndex: 1,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%'
            }}>
              <FavoriteButton book={book} />
            </Box>
          )}
        </BookCoverContainer>
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            noWrap
            sx={{ fontWeight: 'bold' }}
          >
            {book.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {book.authors?.join(', ') || 'Unknown author'}
          </Typography>
          
          {book.publishedDate && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Published: {book.publishedDate}
            </Typography>
          )}
          
          {book.categories && book.categories.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {book.categories.slice(0, 2).map((category, index) => (
                <Chip 
                  key={index} 
                  label={category} 
                  size="small" 
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

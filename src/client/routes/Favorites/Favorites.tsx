import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Paper,
  useTheme
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Book } from '../../../server/books-api/types';
import { useRouter } from '../../router';
import { BookGrid } from '../../components/BookGrid';
import { getFavoriteBooks, removeFromFavorites } from '../../utils/favoritesStorage';

export const Favorites = () => {
  const theme = useTheme();
  const { navigate } = useRouter();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Load favorite books from local storage
  useEffect(() => {
    const books = getFavoriteBooks();
    setFavoriteBooks(books);
  }, [updateTrigger]);

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  const handleRemoveAll = () => {
    if (window.confirm('Are you sure you want to remove all books from favorites?')) {
      // Remove all books from favorites
      favoriteBooks.forEach(book => {
        removeFromFavorites(book.id);
      });
      
      // Trigger update
      setUpdateTrigger(prev => prev + 1);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '2.5rem' },
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <FavoriteIcon color="error" sx={{ fontSize: 'inherit' }} />
          Favorite Books
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          align="center"
          sx={{ mb: 3 }}
        >
          Your collection of saved books
        </Typography>
      </Box>

      {favoriteBooks.length > 0 ? (
        <>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ fontWeight: 'medium' }}
            >
              {favoriteBooks.length} {favoriteBooks.length === 1 ? 'Book' : 'Books'} in your collection
            </Typography>
            
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteSweepIcon />}
              onClick={handleRemoveAll}
              sx={{ borderRadius: 2 }}
            >
              Remove All
            </Button>
          </Box>
          
          <Divider sx={{ mb: 4 }} />
          
          <BookGrid 
            books={favoriteBooks} 
            onBookClick={handleBookClick} 
          />
        </>
      ) : (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: theme.shape.borderRadius * 2,
            gap: 2,
            bgcolor: 'background.paper'
          }}
        >
          <FavoriteIcon sx={{ fontSize: 80, color: 'text.disabled', opacity: 0.5 }} />
          
          <Typography variant="h6" color="text.secondary" align="center">
            Your favorites collection is empty
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
            Start adding books to your favorites from the search page
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/book-search')}
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold'
            }}
          >
            Search Books
          </Button>
        </Paper>
      )}
    </Container>
  );
};

import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Chip, CircularProgress, Alert, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from '../../router';
import { getBookById } from '../../../apis/books/client';
import { Book } from '../../../server/books-api/types';
import { FavoriteButton } from '../../components/FavoriteButton';

export const BookDetails = () => {
  const { routeParams, navigate } = useRouter();
  const bookId = routeParams.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) {
        setError('Book ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getBookById({ id: bookId });
        
        if (response.data.error) {
          setError(response.data.error);
        } else if (!response.data.book) {
          setError('Book not found');
        } else {
          setBook(response.data.book);
        }
      } catch (err) {
        setError(`Error loading book details: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleBackToSearch = () => {
    navigate('/book-search');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToSearch}
          sx={{ mb: 2 }}
        >
          Back to Search
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToSearch}
          sx={{ mb: 2 }}
        >
          Back to Search
        </Button>
        <Alert severity="info">No book information available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToSearch}
        >
          Back to Search
        </Button>
        
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => navigate('/favorites')}
        >
          View Favorites
        </Button>
      </Box>

      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 4 }}>
        <Box sx={{ 
          width: { xs: '100%', md: 300 }, 
          height: { xs: 300, md: 'auto' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'grey.100',
          p: 2,
          position: 'relative'
        }}>
          <CardMedia
            component="img"
            image={book.imageLinks?.thumbnail || '/placeholder-book.png'}
            alt={book.title}
            sx={{ 
              maxHeight: '100%', 
              maxWidth: '100%', 
              objectFit: 'contain',
              boxShadow: 3
            }}
          />
          <Box sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8,
            zIndex: 1,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%'
          }}>
            <FavoriteButton book={book} size="large" />
          </Box>
        </Box>
        
        <CardContent sx={{ flex: 1, p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {book.title}
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            by {book.authors?.join(', ') || 'Unknown Author'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {book.categories?.map((category, index) => (
              <Chip key={index} label={category} size="small" />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="overline" display="block">Published</Typography>
              <Typography variant="body2">{book.publishedDate || 'Unknown'}</Typography>
            </Box>
            
            <Box>
              <Typography variant="overline" display="block">Pages</Typography>
              <Typography variant="body2">{book.pageCount || 'Unknown'}</Typography>
            </Box>
            
            <Box>
              <Typography variant="overline" display="block">Language</Typography>
              <Typography variant="body2">{book.language?.toUpperCase() || 'Unknown'}</Typography>
            </Box>
          </Box>
          
          {book.previewLink && (
            <Button 
              variant="outlined" 
              href={book.previewLink} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ mr: 2, mb: { xs: 2, md: 0 } }}
            >
              Preview
            </Button>
          )}
          
          {book.infoLink && (
            <Button 
              variant="outlined" 
              href={book.infoLink} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              More Info
            </Button>
          )}
        </CardContent>
      </Card>
      
      <Typography variant="h5" component="h2" gutterBottom>
        Description
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="body1" paragraph>
        {book.description || 'No description available for this book.'}
      </Typography>
    </Box>
  );
};

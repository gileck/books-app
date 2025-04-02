import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert,
  Container,
  InputAdornment,
  Paper,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { searchBooks } from '../../../apis/books/client';
import { Book } from '../../../server/books-api/types';
import { useRouter } from '../../router';
import { BookGrid } from '../../components/BookGrid';

// Styled search container
const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
}));

const BookSearch = () => {
  const { navigate, queryParams } = useRouter();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  
  // Initialize query from URL and perform search if query exists
  useEffect(() => {
    const searchQuery = queryParams.q;
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [queryParams.q]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchBooks({ query: searchQuery });
      setBooks(response.data.books);
      setTotalItems(response.data.totalItems);
      
      if (response.data.error) {
        setError(response.data.error);
      } else if (response.data.books.length === 0) {
        setError('No books found. Try a different search term.');
      }
    } catch (err) {
      setError(`Error searching for books: ${err instanceof Error ? err.message : String(err)}`);
      setBooks([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Update URL with search query
    navigate(`/book-search?q=${encodeURIComponent(query)}`, { replace: true });
    performSearch(query);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setBooks([]);
    setTotalItems(0);
    setError(null);
    navigate('/book-search', { replace: true });
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}
      >
        Book Search
      </Typography>
      
      <SearchContainer elevation={3}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 2
        }}>
          <TextField
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for books, authors, or topics..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton 
                    edge="end" 
                    onClick={handleClearSearch}
                    aria-label="clear search"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 2,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' },
              }
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSearch}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ 
              py: 1.5, 
              px: 4,
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' },
              whiteSpace: 'nowrap',
              boxShadow: 3,
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Box>
      </SearchContainer>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            borderRadius: 2,
            boxShadow: 2
          }}
        >
          {error}
        </Alert>
      )}

      {books.length > 0 && (
        <Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'medium',
                color: 'text.secondary'
              }}
            >
              Found {totalItems.toLocaleString()} books
            </Typography>
            <Chip 
              label={`"${queryParams.q}"`} 
              color="primary" 
              variant="outlined" 
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
          
          <Divider sx={{ mb: 4 }} />
          
          <BookGrid books={books} onBookClick={handleBookClick} />
        </Box>
      )}

      {loading && books.length === 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
          my: 8,
          gap: 2
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Searching for books...
          </Typography>
        </Box>
      )}

      {!loading && books.length === 0 && !error && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
          my: 8,
          gap: 2
        }}>
          <SearchIcon sx={{ fontSize: 80, color: 'text.disabled', opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary">
            Enter a search term to find books
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default BookSearch;

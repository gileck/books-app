import { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { searchBooks } from '../../../apis/books/client';
import { Book } from '../../../server/books-api/types';
import { BookApiProvider } from '../../../apis/books/types';
import { useRouter } from '../../router';
import { BookList } from '../../components/BookList';

// Styled search container
const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
  },
}));

// Local storage key for API provider
const API_PROVIDER_STORAGE_KEY = 'books-app-api-provider';

const BookSearch = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { navigate, queryParams } = useRouter();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [apiProvider, setApiProvider] = useState<BookApiProvider>('google');
  
  // Memoize performSearch to avoid recreating it on every render
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchBooks({ 
        query: searchQuery,
        provider: apiProvider 
      });
      
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
  }, [apiProvider]);
  
  // Initialize query from URL and perform search if query exists
  useEffect(() => {
    const searchQuery = queryParams.q;
    
    // Load API provider from local storage
    const savedProvider = localStorage.getItem(API_PROVIDER_STORAGE_KEY) as BookApiProvider | null;
    if (savedProvider) {
      setApiProvider(savedProvider);
    }
    
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [queryParams.q, performSearch]);

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
  
  const handleApiProviderChange = (event: SelectChangeEvent<BookApiProvider>) => {
    const newProvider = event.target.value as BookApiProvider;
    setApiProvider(newProvider);
    
    // Save to local storage
    localStorage.setItem(API_PROVIDER_STORAGE_KEY, newProvider);
    
    // If there's an active search, re-run it with the new provider
    if (query.trim()) {
      performSearch(query);
    }
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: { xs: 1.5, sm: 3, md: 4 }, 
        pl: { xs: 0, sm: 0 },
        pr: { xs: 1, sm: 2, md: 3 } 
      }}
      disableGutters
    >
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{ 
          mb: { xs: 2, sm: 3, md: 4 }, 
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}
      >
        Book Search
      </Typography>
      
      <SearchContainer elevation={3}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: { xs: 1, sm: 2 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: { xs: 1, sm: 2 }
          }}>
            <TextField
              fullWidth
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for books, authors, or topics..."
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize={isMobile ? "small" : "medium"} />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton 
                      edge="end" 
                      onClick={handleClearSearch}
                      aria-label="clear search"
                      size={isMobile ? "small" : "medium"}
                    >
                      <ClearIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> : null}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                py: { xs: 1, sm: 1.5 }, 
                px: { xs: 2, sm: 4 },
                borderRadius: 2,
                width: { xs: '100%', sm: 'auto' },
                whiteSpace: 'nowrap',
                boxShadow: 3,
                fontWeight: 'bold',
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Box>
          
          <FormControl 
            size={isMobile ? "small" : "medium"}
            sx={{ 
              marginTop: { xs: 2, sm: 1 },
              minWidth: { xs: '100%', sm: 200 },
              alignSelf: { xs: 'stretch', sm: 'flex-start' }
            }}
          >
            <InputLabel id="api-provider-label">Search Provider</InputLabel>
            <Select
              labelId="api-provider-label"
              id="api-provider-select"
              value={apiProvider}
              label="Search Provider"
              onChange={handleApiProviderChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="google">Google Books</MenuItem>
              <MenuItem value="openlibrary">Open Library Books</MenuItem>
              <MenuItem value="ai">AI Books Search</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </SearchContainer>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: 2,
            boxShadow: 2,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
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
            mb: { xs: 1.5, sm: 2, md: 3 },
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Typography 
              variant="body2" 
              component="div" 
              sx={{ 
                fontWeight: 'medium',
                color: 'text.secondary',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Found {totalItems.toLocaleString()} books
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={`"${queryParams.q}"`} 
                color="primary" 
                variant="outlined" 
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  fontWeight: 'medium',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              />
              <Chip 
                label={apiProvider === 'google' ? 'Google Books' : 
                       apiProvider === 'openlibrary' ? 'Open Library' : 'AI Search'} 
                color="secondary" 
                variant="outlined" 
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  fontWeight: 'medium',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              />
            </Box>
          </Box>
          
          <Divider sx={{ mb: { xs: 2, sm: 3, md: 4 } }} />
          
          <BookList books={books} onBookClick={handleBookClick} />
        </Box>
      )}

      {loading && books.length === 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
          my: { xs: 4, sm: 6, md: 8 },
          gap: { xs: 1, sm: 2 }
        }}>
          <CircularProgress size={isMobile ? 40 : 60} thickness={4} />
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' } }}
          >
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
          my: { xs: 4, sm: 6, md: 8 },
          gap: { xs: 1, sm: 2 }
        }}>
          <SearchIcon sx={{ fontSize: { xs: 50, sm: 80 }, color: 'text.disabled', opacity: 0.5 }} />
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' } }}
          >
            Enter a search term to find books
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default BookSearch;

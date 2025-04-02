import { 
  Box, 
  Typography, 
  Paper,
  List,
  ListItem,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Book } from '../../server/books-api/types';
import { useState } from 'react';

interface BookListProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
  showFavoriteButtons?: boolean;
}

export const BookList = ({ books, onBookClick, showFavoriteButtons = true }: BookListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [savedBooks, setSavedBooks] = useState<Record<string, boolean>>({});

  const toggleSaveBook = (bookId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSavedBooks(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  // Function to estimate reading time based on page count
  const estimateReadingTime = (pageCount: number): number => {
    if (!pageCount) return 0;
    // Assuming average reading speed of 2 minutes per page
    return Math.round(pageCount / 15);
  };

  // Function to count chapters (using categories as a proxy since we don't have chapter info)
  const getChapterCount = (book: Book): number => {
    if (book.categories && book.categories.length > 0) {
      return book.categories.length + Math.floor(Math.random() * 10) + 5; // Simulating chapter count
    }
    return Math.floor(Math.random() * 15) + 5; // Default random chapter count
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', pl: 0 }}>
      <List disablePadding>
        {books.map((book, index) => (
          <Box key={book.id}>
            <ListItem 
              disablePadding 
              sx={{ 
                py: { xs: 1.5, sm: 2 }, 
                px: 0,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.02)'
                }
              }}
              onClick={() => onBookClick(book.id)}
            >
              <Box sx={{ 
                display: 'flex', 
                width: '100%',
                pl: 0,
                pr: { xs: 1, sm: 2 },
                gap: { xs: 1, sm: 2 }
              }}>
                {/* Book Cover */}
                <Box sx={{ 
                  width: { xs: 100, sm: 120 }, 
                  height: { xs: 150, sm: 180 }, 
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  borderRadius: 1,
                  boxShadow: 2
                }}>
                  <img 
                    src={book.imageLinks?.thumbnail || '/placeholder-book.png'} 
                    alt={book.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover'
                    }}
                  /> 
                </Box>
                
                {/* Book Details */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '100%',
                  py: { xs: 0.5, sm: 1 }
                }}>
                  {/* Top Section: Title and Save Button */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: { xs: 0.5, sm: 1 }
                  }}>
                    <Box>
                      <Typography 
                        variant={isMobile ? "subtitle1" : "h6"} 
                        component="div" 
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 0.5,
                          fontSize: { xs: '0.95rem', sm: '1.25rem' }
                        }}
                      >
                        {book.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        {book.authors?.join(', ') || 'Unknown author'}
                      </Typography>
                    </Box>
                    
                    {showFavoriteButtons && (
                      <Box>
                        {savedBooks[book.id] ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mr: 0.5, 
                                fontWeight: 'medium',
                                color: 'text.secondary',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                display: { xs: 'none', sm: 'block' }
                              }}
                            >
                              Saved
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={(e) => toggleSaveBook(book.id, e)}
                              color="primary"
                              sx={{ padding: { xs: 0.5, sm: 1 } }}
                            >
                              <BookmarkIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mr: 0.5, 
                                fontWeight: 'medium',
                                color: 'text.secondary',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                display: { xs: 'none', sm: 'block' }
                              }}
                            >
                              Save
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={(e) => toggleSaveBook(book.id, e)}
                              color="default"
                              sx={{ padding: { xs: 0.5, sm: 1 } }}
                            >
                              <BookmarkBorderIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                  
                  {/* Book description - truncated */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: { xs: 1, sm: 2 },
                      display: '-webkit-box',
                      WebkitLineClamp: { xs: 1, sm: 2 },
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {book.description || 'No description available.'}
                  </Typography>
                  
                  {/* Bottom Section: Chapters and Reading Time */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: { xs: 2, sm: 3 }
                  }}>
                  </Box>
                </Box>
              </Box>
            </ListItem>
            {index < books.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Paper>
  );
};

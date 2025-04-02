import { 
  Box, 
  Typography, 
  Paper,
  List,
  ListItem,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import Image from 'next/image';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
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
                  boxShadow: 2,
                  position: 'relative'
                }}>
                  <Image 
                    src={book.imageLinks?.thumbnail || '/placeholder-book.png'} 
                    alt={book.title}
                    fill
                    sizes="(max-width: 600px) 100px, 120px"
                    style={{ 
                      objectFit: 'cover'
                    }}
                    priority={index < 3}
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
                  
                  {/* Bottom Section: Published Date */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: { xs: 2, sm: 3 }
                  }}>
                    <Chip
                      icon={<CalendarTodayIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />}
                      label={`Published: ${book.publishedDate || 'Unknown'}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: { xs: 24, sm: 28 },
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        '& .MuiChip-icon': { 
                          color: 'text.secondary',
                          ml: 0.5
                        }
                      }}
                    />
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

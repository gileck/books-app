import { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Book } from '../../server/books-api/types';
import { addToFavorites, removeFromFavorites, isBookInFavorites } from '../utils/favoritesStorage';

interface FavoriteButtonProps {
  book: Book;
  size?: 'small' | 'medium' | 'large';
  color?: 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'default' | 'inherit';
  onChange?: (isFavorite: boolean) => void;
}

export const FavoriteButton = ({ 
  book, 
  size = 'medium', 
  color = 'error',
  onChange 
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Check if book is in favorites on mount
  useEffect(() => {
    setIsFavorite(isBookInFavorites(book.id));
  }, [book.id]);
  
  const handleToggleFavorite = (event: React.MouseEvent) => {
    // Prevent the click from propagating to parent elements
    event.stopPropagation();
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    if (newFavoriteState) {
      addToFavorites(book);
    } else {
      removeFromFavorites(book.id);
    }
    
    // Notify parent component if onChange callback is provided
    if (onChange) {
      onChange(newFavoriteState);
    }
  };
  
  return (
    <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
      <IconButton 
        onClick={handleToggleFavorite}
        size={size}
        color={color}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

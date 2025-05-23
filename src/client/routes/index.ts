import { Home } from './Home';
import { NotFound } from './NotFound';
import { AIChat } from './AIChat';
import { Settings } from './Settings';
import { FileManager } from './FileManager';
import { AIMonitoring } from './AIMonitoring';
import BookSearch from './BookSearch/BookSearch';
import { BookDetails } from './BookDetails/BookDetails';
import { Favorites } from './Favorites';
import { createRoutes } from '../router';

// Define routes
export const routes = createRoutes({
  '/': BookSearch,
  '/book-search': BookSearch,
  '/home': Home,
  '/ai-chat': AIChat,
  '/settings': Settings,
  '/file-manager': FileManager,
  '/ai-monitoring': AIMonitoring,
  '/book/:id': BookDetails,
  '/favorites': Favorites,
  '/not-found': NotFound,
});

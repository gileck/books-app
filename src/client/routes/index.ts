import { Home } from './Home';
import { NotFound } from './NotFound';
import { AIChat } from './AIChat';
import { Settings } from './Settings';
import { FileManager } from './FileManager';
import { AIMonitoring } from './AIMonitoring';
import { createRoutes } from '../router';

// Export all route components
export { Home } from './Home';
export { NotFound } from './NotFound';
export { AIChat } from './AIChat';
export { Settings } from './Settings';
export { FileManager } from './FileManager';
export { AIMonitoring } from './AIMonitoring';

// Define routes
export const routes = createRoutes({
  '/': Home,
  '/ai-chat': AIChat,
  '/settings': Settings,
  '/file-manager': FileManager,
  '/ai-monitoring': AIMonitoring,
  '/not-found': NotFound,
});

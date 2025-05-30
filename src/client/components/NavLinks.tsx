import { NavItem } from './layout/types';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';

export const navItems: NavItem[] = [ 
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/book-search', label: 'Search', icon: <SearchIcon /> },
    { path: '/favorites', label: 'Favorites', icon: <FavoriteIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];
  
  export const menuItems: NavItem[] = [ 
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/ai-chat', label: 'AI Chat', icon: <ChatIcon /> },
    { path: '/file-manager', label: 'Files', icon: <FolderIcon /> },
    { path: '/book-search', label: 'Search', icon: <SearchIcon /> },
    { path: '/favorites', label: 'Favorites', icon: <FavoriteIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
    { path: '/ai-monitoring', label: 'AI Monitoring', icon: <InsightsIcon /> },
  ];
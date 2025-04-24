import { ActionDefinition } from '../../types';
import { createBookChaptersPrompt } from './prompt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { ChaptersRenderer } from '@/client/components/Book/AiActions/ChaptersRenderer';

export * from './types';
export * from './prompt';

export const chaptersActionDefinition: ActionDefinition = {
    prompt: createBookChaptersPrompt
}

export const chaptersDefinition = {
    definition: chaptersActionDefinition,
    label: 'Chapters',
    Icon: MenuBookIcon,
    renderer: ChaptersRenderer,
}; 
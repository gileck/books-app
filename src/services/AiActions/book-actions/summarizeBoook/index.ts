import { ActionDefinition } from '../../types';
import { createBookSummaryPrompt } from './prompt';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { BookSummaryRenderer } from '@/client/components/Book/AiActions/BookSummaryRenderer';

export * from './summarizeBook';
export * from './types';
export * from './prompt';

export const summaryActionDefinition: ActionDefinition = {
    prompt: createBookSummaryPrompt
}

export const summaryDefinition = {
    definition: summaryActionDefinition,
    label: 'Summary',
    Icon: SummarizeIcon,
    renderer: BookSummaryRenderer,
};
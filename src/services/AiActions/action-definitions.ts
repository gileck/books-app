import { ActionDefinition } from './types';
import { keypointsActionDefinition } from './book-actions/keypoints';
import { summaryActionDefinition } from './book-actions/summarizeBoook';
import SummarizeIcon from '@mui/icons-material/Summarize';
import BulletedListIcon from '@mui/icons-material/FormatListBulleted';
import { BookSummaryRenderer } from '@/client/components/Book/AiActions/BookSummaryRenderer';
import { KeyPointsRenderer } from '@/client/components/Book/AiActions/KeyPointsRenderer';
import { BookSummaryResult } from './book-actions/summarizeBoook/types';
import { KeyPointsAIResponse } from './book-actions/keypoints/types';

export interface ActionDefinitionWithUI<T> {
  definition: ActionDefinition;
  label: string;
  Icon: React.ComponentType;
  renderer: React.ComponentType<{ result: T }>;
}

export type ActionDefinitionsMap = {
  summary: ActionDefinitionWithUI<BookSummaryResult>;
  keypoints: ActionDefinitionWithUI<KeyPointsAIResponse>;
};

export const actionDefinitions: ActionDefinitionsMap = {
  summary: {
    definition: summaryActionDefinition,
    label: 'Summary',
    Icon: SummarizeIcon,
    renderer: BookSummaryRenderer,
  },
  keypoints: {
    definition: keypointsActionDefinition,
    label: 'Key Points',
    Icon: BulletedListIcon,
    renderer: KeyPointsRenderer,
  },
}; 
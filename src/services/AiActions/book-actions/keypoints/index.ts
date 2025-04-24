import { ActionDefinition } from '../../types';
import { createKeyPointsPrompt } from './prompt';
import BulletedListIcon from '@mui/icons-material/FormatListBulleted';
import { KeyPointsRenderer } from '@/client/components/Book/AiActions/KeyPointsRenderer';

export * from './keypoints';
export * from './types';
export * from './prompt'; 

export const keypointsActionDefinition: ActionDefinition = {
    prompt: createKeyPointsPrompt
}

export const keypointsDefinition = {
    definition: keypointsActionDefinition,
    label: 'Key Points',
    Icon: BulletedListIcon,
    renderer: KeyPointsRenderer,
};
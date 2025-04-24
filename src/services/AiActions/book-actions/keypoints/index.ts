import { ActionDefinition } from '../../types';
import { createKeyPointsPrompt } from './prompt';
export * from './keypoints';
export * from './types';
export * from './prompt'; 

export const keypointsActionDefinition: ActionDefinition = {
    prompt: createKeyPointsPrompt
}
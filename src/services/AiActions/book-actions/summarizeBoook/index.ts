import { ActionDefinition } from '../../types';
import { createBookSummaryPrompt } from './prompt';
export * from './summarizeBook';
export * from './types';
export * from './prompt';

export const summaryActionDefinition: ActionDefinition = {
    prompt: createBookSummaryPrompt
}
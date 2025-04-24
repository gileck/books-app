import { ActionDefinition } from "../types";

import { keypointsActionDefinition } from "./keypoints";
import { summaryActionDefinition } from "./summarizeBoook";

export type AiActionType = 'summary' | 'keypoints'


export const actionHandlers: Record<AiActionType, ActionDefinition> = {
    summary: summaryActionDefinition,
    keypoints: keypointsActionDefinition,
  };
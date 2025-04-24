import { ActionDefinition } from "../types";
import { chaptersDefinition } from "./chapters";
import { BookChaptersResult } from "./chapters/types";
import { KeyPointsAIResponse, keypointsDefinition } from "./keypoints";
import { BookSummaryResult, summaryDefinition } from "./summarizeBoook";
import React from "react";

export type AiActionType = 'summary' | 'keypoints' | 'chapters';

export interface ActionDefinitionWithUI<T> {
  definition: ActionDefinition;
  label: string;
  Icon: React.ComponentType;
  renderer: React.ComponentType<{ result: T }>;
}

export type ActionDefinitionsMap = {
  summary: ActionDefinitionWithUI<BookSummaryResult>;
  keypoints: ActionDefinitionWithUI<KeyPointsAIResponse>;
  chapters: ActionDefinitionWithUI<BookChaptersResult>;
};

export const actionDefinitions: ActionDefinitionsMap = {
  summary: summaryDefinition,
  keypoints: keypointsDefinition,
  chapters: chaptersDefinition,
};

// Create a map of just the handlers for internal use
export const actionHandlers: Record<AiActionType, ActionDefinition> = {
  summary: summaryDefinition.definition,
  keypoints: keypointsDefinition.definition,
  chapters: chaptersDefinition.definition,
};

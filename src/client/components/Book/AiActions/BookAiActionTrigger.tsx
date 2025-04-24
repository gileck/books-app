import React, { useState } from 'react';
import { Button, Box, CircularProgress, Stack } from '@mui/material';
import { AiActionType } from '../../../../services/AiActions/types';
import { BookAiActionResponse } from '../../../../apis/aiBookActions/types';
import { BookAiActionResultRenderer } from './BookAiActionResultRenderer';
import { actionDefinitions } from '../../../../services/AiActions/action-definitions';

interface BookAiActionTriggerProps {
  bookId: string;
  onAction: (bookId: string, actionType: AiActionType) => Promise<BookAiActionResponse>;
}

interface ActionState {
  loading: boolean;
  error: string | null;
  result: BookAiActionResponse | null;
}

type ActionStates = {
  [K in AiActionType]: ActionState;
};

/**
 * A component that renders buttons for all available AI actions for a book
 */
export const BookAiActionTrigger: React.FC<BookAiActionTriggerProps> = ({
  bookId,
  onAction
}) => {
  const [actionStates, setActionStates] = useState<ActionStates>(
    Object.keys(actionDefinitions).reduce((acc, type) => ({
      ...acc,
      [type]: { loading: false, error: null, result: null }
    }), {} as ActionStates)
  );

  const handleAction = async (actionType: AiActionType) => {
    try {
      setActionStates(prev => ({
        ...prev,
        [actionType]: { ...prev[actionType], loading: true, error: null }
      }));

      const response = await onAction(bookId, actionType);
      
      setActionStates(prev => ({
        ...prev,
        [actionType]: { loading: false, error: null, result: response }
      }));
    } catch (error) {
      setActionStates(prev => ({
        ...prev,
        [actionType]: {
          loading: false,
          error: `Error: ${error instanceof Error ? error.message : String(error)}`,
          result: null
        }
      }));
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2}>
        {Object.entries(actionDefinitions).map(([type, { label, Icon }]) => (
          <Button
            key={type}
            variant="outlined"
            onClick={() => handleAction(type as AiActionType)}
            disabled={actionStates[type as AiActionType].loading}
            startIcon={actionStates[type as AiActionType].loading ? <CircularProgress size={20} /> : <Icon />}
            size="small"
          >
            {actionStates[type as AiActionType].loading ? 'Processing...' : label}
          </Button>
        ))}
      </Stack>

      {/* Display results for each action */}
      <Stack spacing={2}>
        {Object.entries(actionDefinitions).map(([type]) => (
          <BookAiActionResultRenderer
            key={type}
            actionType={type as AiActionType}
            result={actionStates[type as AiActionType].result}
            loading={actionStates[type as AiActionType].loading}
            error={actionStates[type as AiActionType].error}
          />
        ))}
      </Stack>
    </Box>
  );
}; 
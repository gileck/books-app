import React, { useState } from 'react';
import { Button, Box, Stack } from '@mui/material';
import { AiActionType } from '../../../../services/AiActions/types';
import { BookAiActionResponse } from '../../../../apis/aiBookActions/types';
import { BookAiActionResultRenderer } from './BookAiActionResultRenderer';
import { actionDefinitions } from '../../../../services/AiActions';

interface BookAiActionTriggerProps {
  bookId: string;
  onAction: (bookId: string, actionType: AiActionType, bypassCache?: boolean) => Promise<BookAiActionResponse>;
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
  const [activeActionType, setActiveActionType] = useState<AiActionType | null>(null);

  const handleAction = async (actionType: AiActionType, bypassCache = false) => {
    try {
      setActiveActionType(actionType);
      setActionStates(prev => ({
        ...prev,
        [actionType]: { ...prev[actionType], loading: true, error: null }
      }));

      const response = await onAction(bookId, actionType, bypassCache);
      
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

  const handleRegenerate = async (bookId: string, actionType: AiActionType, bypassCache: boolean) => {
    await handleAction(actionType, bypassCache);
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
            startIcon={<Icon />}
            size="small"
          >
            {label}
          </Button>
        ))}
      </Stack>

      {/* Display only the active action result */}
      {activeActionType && (
        <BookAiActionResultRenderer
          actionType={activeActionType}
          result={actionStates[activeActionType].result}
          loading={actionStates[activeActionType].loading}
          error={actionStates[activeActionType].error}
          bookId={bookId}
          onRegenerate={handleRegenerate}
        />
      )}
    </Box>
  );
}; 
import React from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { AiActionType } from '../../../../services/AiActions/types';
import { BookAiActionResponse } from '../../../../apis/aiBookActions/types';
import { actionDefinitions } from '../../../../services/AiActions/action-definitions';



interface BookAiActionResultRendererProps {
  actionType: AiActionType;
  result: BookAiActionResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic renderer for AI action results
 * Delegates to specific renderers based on action type
 */
export const BookAiActionResultRenderer: React.FC<BookAiActionResultRendererProps> = ({
  actionType,
  result,
  loading,
  error
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!result) {
    return null;
  }

  if (result.error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {result.error}
      </Alert>
    );
  }

  // Generic AI cost info
  const costInfo = result.cost?.totalCost !== undefined ? (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary">
        AI Cost: ${result.cost.totalCost.toFixed(4)}
      </Typography>
    </Box>
  ) : null;

  const actionDefinition = actionDefinitions[actionType];
  if (!actionDefinition) {
    return (
      <Box>
        {costInfo}
        <Typography variant="body2" color="text.secondary">Unknown action type.</Typography>
      </Box>
    );
  }

  

  const Renderer = actionDefinition.renderer;
  return (
    <Box>
      {costInfo}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Renderer result={result.result as any} />
    </Box>
  );
}; 
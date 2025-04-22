import React from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { AiActionType } from '../../../../services/AiActions/types';
import { BookSummaryRenderer } from './BookSummaryRenderer';
import { BookAiActionResponse } from '../../../../apis/aiBookActions/types';
import { BookSummaryResult } from '../../../../services/AiActions/book-actions/summarizeBoook/types';

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

  // Render the appropriate component based on action type
  switch (actionType) {
    case 'summary':
      return (
        <Box>
          {costInfo}
          <BookSummaryRenderer result={result.result as BookSummaryResult} />
        </Box>
      );
    case 'qa':
      // For future implementation
      return (
        <Box>
          {costInfo}
          <Typography variant="body2" color="text.secondary">Q&A rendering not implemented.</Typography>
        </Box>
      );
    case 'themes':
      // For future implementation
      return (
        <Box>
          {costInfo}
          <Typography variant="body2" color="text.secondary">Themes rendering not implemented.</Typography>
        </Box>
      );
    default:
      return (
        <Box>
          {costInfo}
          <Typography variant="body2" color="text.secondary">Unknown action type.</Typography>
        </Box>
      );
  }
};

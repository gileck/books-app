import React, { useState } from 'react';
import { Box, Button, Typography, Divider, Paper, ButtonGroup } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { AiActionType } from '../../../../services/AiActions/types';
import { performBookAiAction } from '../../../../apis/aiBookActions/client';
import { BookAiActionResponse } from '../../../../apis/aiBookActions/types';
import { BookAiActionResultRenderer } from './BookAiActionResultRenderer';

interface BookAiActionTriggerProps {
  bookId: string;
}

/**
 * Component for triggering AI actions on a book
 */
export const BookAiActionTrigger: React.FC<BookAiActionTriggerProps> = ({ bookId }) => {
  const [selectedAction, setSelectedAction] = useState<AiActionType | null>(null);
  const [actionResult, setActionResult] = useState<BookAiActionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActionClick = async (actionType: AiActionType) => {
    setSelectedAction(actionType);
    setLoading(true);
    setError(null);
    
    try {
      const response = await performBookAiAction({
        bookId,
        actionType
      });
      
      if (response.data.error) {
        setError(response.data.error);
        setActionResult(null);
      } else {
        setActionResult(response.data);
      }
    } catch (err) {
      setError(`Error performing AI action: ${err instanceof Error ? err.message : String(err)}`);
      setActionResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        AI Actions
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Paper elevation={0} sx={{ p: { xs: 0, sm: 3 }, bgcolor: 'background.default' }}>
        <Typography variant="body1" paragraph>
          Use AI to analyze this book and generate insights.
        </Typography>
        
        <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
          <Button 
            startIcon={<AutoStoriesIcon />}
            onClick={() => handleActionClick('summary')}
            color={selectedAction === 'summary' ? 'primary' : 'inherit'}
            variant={selectedAction === 'summary' ? 'contained' : 'outlined'}
          >
            Summarize
          </Button>
          {/* Additional action buttons can be added here in the future */}
        </ButtonGroup>
        
        {selectedAction && (
          <BookAiActionResultRenderer
            actionType={selectedAction}
            result={actionResult}
            loading={loading}
            error={error}
          />
        )}
      </Paper>
    </Box>
  );
};

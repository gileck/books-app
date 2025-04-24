import React from 'react';
import { Button, Tooltip, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AiActionType } from '../../../../services/AiActions/types';

interface RegenerateButtonProps {
  actionType: AiActionType;
  bookId: string;
  disabled?: boolean;
  onRegenerate: (bookId: string, actionType: AiActionType, bypassCache: boolean) => Promise<void>;
}

/**
 * A button to regenerate AI action results by bypassing the cache
 */
export const RegenerateButton: React.FC<RegenerateButtonProps> = ({
  actionType,
  bookId,
  disabled = false,
  onRegenerate
}) => {
  const [isRegenerating, setIsRegenerating] = React.useState(false);

  const handleRegenerate = async () => {
    if (isRegenerating) return;
    
    setIsRegenerating(true);
    try {
      await onRegenerate(bookId, actionType, true);
    } catch (error) {
      console.error('Failed to regenerate:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Box sx={{ display: 'inline-flex', ml: 1 }}>
      <Tooltip title="Regenerate with fresh data">
        <span>
          <Button
            size="small"
            color="primary"
            onClick={handleRegenerate}
            disabled={disabled || isRegenerating}
            sx={{ minWidth: 'auto', p: '4px' }}
          >
            <RefreshIcon fontSize="small" />
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
}; 
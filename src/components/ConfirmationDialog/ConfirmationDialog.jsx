import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import PropTypes from 'prop-types';

const ConfirmationDialog = ({ 
  open,
  onCancel,
  onConfirm,
  title = 'Confirmation',
  confirmButtonText = 'Confirm',
  confirmButtonProps,
  cancelButtonText = 'Cancel',
  cancelButtonProps,
  children,
  showWarningIcon,
  asyncConfirm = false
}) => {
  const [loading, setLoading] = useState(false);
  const onConfirmAsync = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } catch (error) {
      console.error('An error occured during confirmation', error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        <Box display='flex' alignItems='center'>
          {title}
          {showWarningIcon &&
            <Box ml={1} display='flex'>
              <WarningIcon color='warning' />
            </Box>
          }
        </Box>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          onClick={asyncConfirm ? onConfirmAsync : onConfirm}
          endIcon={loading && <CircularProgress sx={{ alignSelf: 'center' }} color='primary' size={19}/>}
          {...confirmButtonProps}
        >
          {confirmButtonText}
        </Button>
        <Button
          variant='outlined'
          onClick={onCancel}
          {...cancelButtonProps}
        >
          {cancelButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  /**
   * Whether the dialog is open
   */
  open: PropTypes.bool.isRequired,
  /**
   * Callback function invoked on cancel
   */
  onCancel: PropTypes.func.isRequired,
  /**
   * Callback function invoked on confirm
   */
  onConfirm: PropTypes.func.isRequired,
  /**
   * Dialog title
   */
  title: PropTypes.string,
  /**
   * Text shown in confirm button
   */
  confirmButtonText: PropTypes.string,
  /**
   * Text Shown in cancel button
   */
  cancelButtonText: PropTypes.string,
  /**
   * Props passed to root MUI component for the confirm button
   */
  confirmButtonProps: PropTypes.object,
  /**
   * Props passed to root MUI component for the cancel button
   */
  cancelButtonProps: PropTypes.object,
  /**
   * Whether to show warning icon in dialog title
   */
  showWarningIcon: PropTypes.bool,
  /**
   * Whether the onConfirm callback is async. Shows a loader on the confirm button if so
   */
  asyncConfirm: PropTypes.bool
}

export default ConfirmationDialog;
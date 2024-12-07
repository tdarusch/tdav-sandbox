import { useSnackbar } from 'notistack';
import React, { useEffect, useState, useCallback } from 'react';
import { useLoading } from '../../lib/LoadingContext';
import sandboxService from '../../lib/SandboxService';
import { Box, Button, ButtonGroup, Card, CardActionArea, Grid2, IconButton, Tooltip, Typography } from '@mui/material';
import OutlinedStarIcon from '@mui/icons-material/StarBorder';
import FilledStarIcon from '@mui/icons-material/Star';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';

const MessageItem = ({ message, onFlag, onArchive, onDelete }) => {
  const { isLoading } = useLoading();
  const { isFlagged, isArchived, email } = message;

  return (
    <Grid2 container columnSpacing={0.5}>
      <Grid2 size={11}>
        <Card sx={{ height: '100%' }}>
          <CardActionArea sx={{ height: '100%' }}>
            <Box display='flex' flexDirection='column' ml={1}>
              <Typography variant='caption'>Sent</Typography>
              <Typography>{message.sentDate}</Typography>
              <Typography variant='caption'>Email</Typography>
              <Typography>{email || 'No Email'}</Typography>
              <Typography variant='caption'>Message</Typography>
              <Typography noWrap>{message.message || 'No Message'}</Typography>
            </Box>
          </CardActionArea>
        </Card>
      </Grid2>
      <Grid2 size={1}>
        <Box display='flex' flexDirection='column' justifyContent='center'>
          <Box my={0.5}>
            <Tooltip title={isFlagged ? 'Unpin' : 'Pin'}>
              <IconButton
                color='primary'
                onClick={() => onFlag({ ...message, isFlagged: !isFlagged })}
                disabled={isLoading}
              >
                {isFlagged ? <FilledStarIcon /> : <OutlinedStarIcon /> }
              </IconButton>
            </Tooltip>
          </Box>
          <Box my={0.5}>
            <Tooltip title={isArchived ? 'Unarchive' : 'Archive'}>
              <IconButton
                color='primary'
                onClick={() => onArchive({ ...message, isArchived: !isArchived })}
                disabled={isLoading}
              >
                {isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box my={0.5}>
            <Tooltip title='Delete'>
              <IconButton
                color='error'
                onClick={() => onDelete(message)}
                disabled={isLoading}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Grid2>
    </Grid2>
  );
};

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [archived, setArchived] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { startLoading, stopLoading } = useLoading();

  const getMessages = useCallback(async ( initialLoad = false ) => {
    try {
      if (initialLoad) {
        startLoading();
      }
      const data = await sandboxService.get('/admin/messages', { params: { archived } });
      setMessages(data);
    } catch (error) {
      console.error('An error occurred while fetching messages.', error)
      enqueueSnackbar('An error occurred while fetching messages.', { variant: 'error' });
    } finally {
      if (initialLoad) {
        stopLoading();
      }
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    getMessages(true);
  }, [getMessages]);

  const handleFlag = async (message) => {
    try {
      startLoading();
      const updatedMessage = await sandboxService.put(`/admin/messages/${message.id}`, message);
      setMessages(prevMessages => prevMessages.map(prevMessage => {
        if (prevMessage.id === updatedMessage.id) {
          return updatedMessage;
        }
        return prevMessage;
      }));
    } catch (error) {
      console.error('An error occurred while pinning the message.', error)
      enqueueSnackbar('An error occurred while pinning the message.', { variant: 'error' });
    } finally {
      stopLoading();
    }
  };

  const handleUpdate = async (message) => {
    try {
      startLoading();
      await sandboxService.put(`/admin/messages/${message.id}`, message);
      getMessages();
    } catch (error) {
      console.error('An error occurred while archiving the message.', error)
      enqueueSnackbar('An error occurred while archiving the message.', { variant: 'error' });
    } finally {
      stopLoading();
    }
  };

  const handleDelete = async (message) => {
    try {
      startLoading();
      await sandboxService.delete(`/admin/messages/${message.id}`, message);
      getMessages();
    } catch (error) {
      console.error('An error occurred while deleting the message.', error)
      enqueueSnackbar('An error occurred while deleting the message.', { variant: 'error' });
    } finally {
      stopLoading();
    }
  };

  const handleArchiveToggle = (archivedValue) => {
    setArchived(archivedValue);
    getMessages();
  };
  
  return(
    <Box display='flex' justifyContent='center' >
      <Box display='flex' flexDirection='column' width={{ xs: '95%', sm: '60%' }} mt={3}>
        <Box display='flex' justifyContent='center'>
          <ButtonGroup>
            <Button
              variant={archived ? 'outlined' : 'contained'}
              onClick={() => handleArchiveToggle(false)}
            >
              Active
            </Button>
            <Button
              variant={!archived ? 'outlined' : 'contained'}
              onClick={() => handleArchiveToggle(true)}
            >
              Archived
            </Button>
          </ButtonGroup>
        </Box>
        {messages?.map(message => (
          <Box key={message.id} my={1}>
            <MessageItem message={message} onFlag={handleFlag} onArchive={handleUpdate} onDelete={handleDelete} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Messages;
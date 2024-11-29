import { Avatar, Box, Grid2, List, ListItemButton, Typography, ListItem, ListSubheader, IconButton, Paper, Collapse } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import ResumeView from './ResumeView';
import { useLoading } from '../../lib/LoadingContext';
import { useCurrentUser } from '../../lib/UserContext';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import sandboxService from '../../lib/SandboxService';
import dayjs from 'dayjs';

const Resume = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('primary');
  const [showResumes, setShowResumes] = useState(true);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { isAdmin } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();

  const getResumes = useCallback(async () => {
    try {
      startLoading();
      const data = await sandboxService.get('/resumes');
      setResumes(data);
    } catch (error) {
      console.error('An error occurred while fetching resumes.', error);
      enqueueSnackbar('An error occurred while fetching resumes.', { variant: 'error' });
    } finally {
      stopLoading();
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    getResumes();
  }, [getResumes]);

  const handleSelectResume = (id) => {
    setSelectedResumeId(id);
  };

  const handleDelete = () => {
    setSelectedResumeId('primary');
    getResumes();
  };

  const handleAddResume = () => {
    setSelectedResumeId(null);
  };

  const handleCreate = (id) => {
    setSelectedResumeId(id);
  };

  return (
    <Box display='flex' justifyContent='center' mt={2}>
      <Box sx={{ width: { xs: '95%', sm: '75%' } }}>
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='top'
          alignItems='center'
          width='100%'
        >
          {isAdmin &&
            <Box
              display='flex'
              flexDirection='column'
              justifyContent='top'
              alignItems='center'
              width='100%'
              mb={2}
            >
              <List sx={{ width: '100%' }} component={Paper}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  pb={0.5}
                  sx={{ borderBottom: (theme) => (showResumes ? `1px solid ${theme.palette.divider}` : 'none') }}
                >
                  <Typography sx={{ ml: 2 }} variant='body2'>Resumes</Typography>
                  <Box display='flex'>
                    <Box mr={0.5}>
                      <IconButton
                        color='primary'
                        disabled={isLoading}
                        onClick={handleAddResume}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Box mr={1}>
                      <IconButton
                        onClick={() => { setShowResumes(prevVal => !prevVal) }}
                      >
                        <MenuIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                <Collapse in={showResumes}>
                  <ListItemButton 
                    selected={selectedResumeId === 'primary'}
                    onClick={() => handleSelectResume('primary')}
                  >
                    <Box
                      display='flex'
                      justifyContent='space-between'
                      width='100%'
                      alignItems='center'
                    >
                      <Typography noWrap>
                        {`Primary ${resumes.find(r => r.isPrimary)?.nickname ? `(${resumes.find(r => r.isPrimary).nickname})` : ''}`}
                      </Typography>
                      <Typography variant='caption' fontStyle='italic'>
                        {resumes.find(resume => resume.isPrimary)?.lastUpdatedDate || 'N/A'}
                      </Typography>
                    </Box>
                  </ListItemButton>
                  {resumes.filter(resume => !resume.isPrimary).sort((a, b) => a.lastUpdatedDate - b.lastUpdatedDate).reverse().map(resume => (
                    <ListItemButton 
                      key={resume.id} 
                      selected={selectedResumeId === resume.id} 
                      onClick={() => handleSelectResume(resume.id)}
                    >
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        width='100%'
                        alignItems='center'
                      >
                        <Typography noWrap>{resume.nickname || 'No name'}</Typography>
                        <Typography variant='caption' fontStyle='italic'>
                          {resume.lastUpdatedDate || dayjs(new Date()).format('MM/DD/YYYY')}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  ))}
                </Collapse>
              </List>
            </Box>
          }
          <Box width='100%'>
            <ResumeView 
              id={selectedResumeId} 
              onUpdate={getResumes} 
              onDelete={handleDelete} 
              onCreate={handleCreate}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Resume;
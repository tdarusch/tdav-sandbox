import { Avatar, Box, Grid2, Typography } from '@mui/material';
import React, { useState } from 'react';
import ResumeView from './ResumeView';

const Resume = () => {
  const [resumeId, setResumeId] = useState('primary');

  return(
    <Box display='flex' justifyContent='center' mt={2}>
      <Box sx={{ width: { xs: '95%', sm: '75%' } }}>
        <ResumeView id={resumeId} />
      </Box>
    </Box>
  );
};

export default Resume;
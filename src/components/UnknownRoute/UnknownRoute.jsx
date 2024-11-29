import PlugIcon from '@mui/icons-material/ElectricalServices';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const UnknownRoute = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/');
  };
  
  return(
    <Box 
      display='flex' 
      justifyContent='center' 
      height='85%' 
      mt={2}
    >
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        sx={{ width: { xs: '95%', sm: '75%' } }}
      >
        <Box
          display='flex'
          alignItems='center'
        >
          <Typography variant='h4'>Not Found</Typography>
          <Box ml={1} display='flex'>
            <PlugIcon fontSize='large' color='warning' />
          </Box>
        </Box>
        <Box 
          display={{ xs: 'flex', sm: 'none' }}
          flexDirection='column' 
          alignItems='center'
          mt={0.5}
        >
          <Typography variant='caption'>
            Please click below to return home.
          </Typography>
          <Box display='flex' justifyContent='center'>
            <IconButton
              color='primary'
              onClick={handleReturnHome}
            >
              <HomeIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UnknownRoute;
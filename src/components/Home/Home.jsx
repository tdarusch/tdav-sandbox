import BuildIcon from '@mui/icons-material/BuildCircle';
import { Box, Typography } from '@mui/material';
import React from 'react';

const Home = () => {

  return (
    <Box display='flex' justifyContent='center' height='85%' mt={2}>
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
          pb={1}
          px={2}
          mb={1}
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}        
        >
          <Typography variant='h4'>Tom's Sandbox</Typography>
          <Box ml={2} display='flex'>
            <BuildIcon fontSize='large' color='primary' />
          </Box>
        </Box>
        <Typography textAlign='center'>
          Currently a WIP - the plan is for this site to serve as a central repository for
          my blog, resume, projects, and small web tools.
        </Typography>
        <Typography sx={{ mt: 1 }}  textAlign='center'>
          Feel free to browse around or send me a message through the contact page.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
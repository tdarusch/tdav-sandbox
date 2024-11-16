import { Avatar, Box, Divider, Grid2, LinearProgress, Tooltip, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import sandboxService from '../../lib/SandboxService';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await sandboxService.get('/contact');
        setContactInfo(data);
      } catch (error) {
        console.error('An error occurred while fetching the contact info.', error);
        enqueueSnackbar('An error occurred while fetching the contact info.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  return(
    <Box display='flex' justifyContent='center' mt={loading ? 0 : 2}>
      {loading && <Box width='100%'><LinearProgress variant='indeterminate'></LinearProgress></Box>}
      {!loading &&
        <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
          <Grid2 container>
            <Grid2 size={{ xs: 12, sm: 6 }} display='flex' justifyContent={{ xs: 'center', sm: 'left' }} alignItems='center'>
              <Typography variant='h6'>Contact Me</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }} display='flex' justifyContent={{ xs: 'center', sm: 'right' }} alignItems='center'>
              {contactInfo.links && contactInfo.links.map(link => (
                <Box mx={0.5}>
                  <Tooltip title={link.label}>
                    <Avatar src={link.imageUrl} component='a' href={link.url} sx={{ width: '30px', height: '30px' }}/>
                  </Tooltip>
                </Box>
              ))}
            </Grid2>
            <Grid2 size={12}>
              <Box display='flex'>
                <Divider sx={{ width: '100%' }}></Divider>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      }
    </Box>
  );
};

export default Contact;
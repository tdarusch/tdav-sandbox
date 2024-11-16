import { Avatar, Box, Button, CircularProgress, Divider, Grid2, LinearProgress, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import sandboxService from '../../lib/SandboxService';
import { useTheme } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import { useFormik } from 'formik';
import FormikTextField from '../FormikTextField/FormikTextField';
import * as Yup from 'yup';
import { useLoading } from '../../lib/LoadingContext';

const validationSchema = Yup.object().shape({
  email: Yup.string(),
  message: Yup.string().required('A message is required')
});

const Contact = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { startLoading, stopLoading } = useLoading();
  const formik = useFormik({
    initialValues: {
      email: '',
      message: ''
    },
    onSubmit: async (values, actions) => {
      try {
        startLoading();
        await sandboxService.post('/messages', values);
        actions.resetForm();
        enqueueSnackbar('Message Sent!', { variant: 'success' });
      } catch (error) {
        console.error('An error occurred while submitting the message.', error);
        enqueueSnackbar('An error occurred while submitting the message.', { variant: 'error' });
      } finally {
        stopLoading();
      }
    },
    validationSchema,
    enableReinitialize: true
  });
  const { handleSubmit, isSubmitting, isValid } = formik;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  useEffect(() => {
    (async () => {
      try {
        startLoading();
        const data = await sandboxService.get('/contact');
        setContactInfo(data);
      } catch (error) {
        console.error('An error occurred while fetching the contact info.', error);
        enqueueSnackbar('An error occurred while fetching the contact info.', { variant: 'error' });
      } finally {
        stopLoading();
      }
    })();
  }, []);
  
  return(
    <>
      <Box display='flex' justifyContent='center' mt={2}>
        {contactInfo &&
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <Grid2 container rowSpacing={1}>
              <Grid2 size={{ xs: 12, sm: 6 }} display='flex' justifyContent={{ xs: 'center', sm: 'left' }} alignItems='center'>
                <Typography variant='h6'>Contact Me</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }} display='flex' justifyContent={{ xs: 'center', sm: 'right' }} alignItems='center'>
                <Box mx={0.5}>
                  <Tooltip title='Mail'>
                    <Avatar component='a' href={`mailto:${contactInfo.email}`} sx={{ width: '30px', height: '30px' }}>
                      <EmailIcon />
                    </Avatar>
                  </Tooltip>
                </Box>
                {contactInfo.links && contactInfo.links.map(link => (
                  <Box mx={0.5} key={link.label}>
                    <Tooltip title={link.label}>
                      <Avatar src={link.imageUrl} component='a' href={link.url} sx={{ width: '30px', height: '30px' }}/>
                    </Tooltip>
                  </Box>
                ))}
              </Grid2>
              <Grid2 size={12}>
                <Divider variant={isMobile ? 'middle' : 'default'} />
              </Grid2>
              <Grid2 size={12} display='flex' justifyContent='center' px={isMobile ? 2 : 0} my={1}>
                <Typography variant='caption' textAlign='center'>{contactInfo.message}</Typography>
              </Grid2>
              <Grid2 size={12} px={isMobile ? 2 : 0}>
                <FormikTextField formik={formik} name='email' label='Contact Email (Optional)' size='small'/>
              </Grid2>
              <Grid2 size={12} px={isMobile ? 2 : 0} my={1}>
                <FormikTextField formik={formik} name='message' label='Message' size='small' multiline minRows={6} />
              </Grid2>
              <Grid2 size={12} display='flex' justifyContent='center' alignItems='center' mb={3}>
                <Button variant='contained' color='primary' size='small' onClick={handleSubmit} disabled={isSubmitting}>
                  <Box display='flex' justifyContent='center' alignItems='center'>
                    Submit
                  </Box>
                </Button>
              </Grid2>
            </Grid2>
          </Box>
        }
      </Box>
    </>
  );
};

export default Contact;
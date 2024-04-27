import React from 'react';
import PageContainer from '../PageContainer/PageContainer';
import { Box, Button, Divider, Heading, VStack } from '@chakra-ui/react';
import FormikTextArea from '../Formik/FormikTextArea/FormikTextArea';
import { useFormik } from 'formik';
import FormikTextfield from '../Formik/FormikTextfield/FormikTextfield';
import { PaperPlaneTilt } from 'phosphor-react';
import SectionHeading from '../SectionHeading/SectionHeading';

const Contact = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: ''
    },
    enableReinitialize: true
  });
  
  return(
    <PageContainer>
      <VStack spacing={2} width='80%'>
        <SectionHeading text='Contact Me' />
        <Box display='flex' justifyContent='center' width='100%'>
          <Box m={1} width='100%'>
            <FormikTextfield 
              name='name'
              label='Name'
              formik={formik}
            />
          </Box>
          <Box m={1} width='100%'>
            <FormikTextfield 
              name='email'
              label='Email'
              formik={formik}
              helperText=''
            />
          </Box>
        </Box>
        <Box w='100%' m={1} px={1} >
          <FormikTextArea 
            name='message'
            label='Message'
            rows={10}
            formik={formik}
          />
        </Box>
        <Box display='flex' justifyContent='center'>
          <Button leftIcon={<PaperPlaneTilt />} bgColor='blue.400'>Send</Button>
        </Box>
      </VStack>
    </PageContainer>
  );
};

export default Contact;
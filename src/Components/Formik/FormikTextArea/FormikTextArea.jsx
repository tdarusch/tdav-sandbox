import { Textarea } from '@chakra-ui/react';
import React from 'react';

const FormikTextArea = ({formik, name, label, ...props}) => {
  
  return(
    <Textarea 
      id={name}
      placeholder={label}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      isInvalid={Boolean(formik.errors[name])}
      width='100%'
      resize='none'
      {...props}
    />
  );
};

export default FormikTextArea;
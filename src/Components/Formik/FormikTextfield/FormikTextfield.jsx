import { Input } from '@chakra-ui/react';
import React from 'react';

const FormikTextfield = ({ formik, name, label, ...props }) => {
  
  return(
    <Input 
      id={name}
      value={formik.values[name]}
      placeholder={label}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      isInvalid={Boolean(formik.errors[name])}
    />
  );
};

export default FormikTextfield;
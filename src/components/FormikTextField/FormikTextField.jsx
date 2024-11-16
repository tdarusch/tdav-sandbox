import { Box, TextField } from '@mui/material';
import React from 'react';

const FormikTextField = (props) => {
  return(
    <Box display='flex' flexDirection='column' width='100%'>
      <TextField
        fullWidth
        id={props.name}
        name={props.name}
        label={props.label}
        value={props.formik.values[props.name] || ''}
        onChange={props.formik.handleChange}
        onBlur={props.formik.handleBur}
        helperText={props.formik.errors[props.name]}
        error={props.formik.errors[props.name]}
        size='small'
        {...props}
      />
    </Box>
  );
};

export default FormikTextField;
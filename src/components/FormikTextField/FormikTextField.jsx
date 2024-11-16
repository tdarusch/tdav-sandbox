import { Box, TextField } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

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

FormikTextField.propTypes = {
  /**
   * Formik object to hook into
   */
  formik: PropTypes.object.isRequired,
  /**
   * Field name
   */
  name: PropTypes.string.isRequired,
  /**
   * Textfield Label
   */
  label: PropTypes.string
};

export default FormikTextField;
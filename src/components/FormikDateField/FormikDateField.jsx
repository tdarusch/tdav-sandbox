import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React from 'react';

const FormikDateField = (props) => {
  return (
    <DatePicker
      id={props.name}
      label={props.label}
      value={props.formik.values[props.name] ? dayjs(props.formik.values[props.name]) : null}
      onChange={(value) => props.formik.setFieldValue(props.name, dayjs(value).isValid() ? dayjs(value).format('MM/DD/YYYY') : null)}
      onBlur={props.formik.handleBlur}
      helperText={props.helperText || ''}
      format='MM/DD/YYYY'
      slotProps={{
        textField: {
          error: props.formik.errors[props.name],
          helperText: props.formik.errors[props.name],
          size: 'small',
          fullWidth: true
        }
      }} 
    />
  );
};

export default FormikDateField;
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import FormikTextField from '../../FormikTextField/FormikTextField';
import FormikDateField from '../../FormikDateField/FormikDateField';

const initialValues = {
  id: null,
  startDate: null,
  endDate: null,
  name: '',
  description: ''
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  startDate: Yup.date().required('Required'),
  endDate: Yup.date().notRequired().min(
    Yup.ref('startDate'),
    'End date cannot be before start date.'
  ),
});

const ProjectDialog = ({ open, project, onSave, onCancel }) => {
  const formik = useFormik({
    initialValues: project || initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      onSave(values);
      formik.resetForm();
    }
  });

  const { handleSubmit, resetForm } = formik;

  const handleCancel = () => {
    onCancel();
    resetForm();
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        Project Editor
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={1} my={1}>
          <Grid2 size={{ xs: 12 }} mb={1}>
            <FormikTextField
              name='name'
              label='Project Name'
              formik={formik}
              charLimit={255}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }} mb={1}>
            <FormikDateField
              name='startDate'
              label='Start Date'
              formik={formik}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }} mb={1}>
            <FormikDateField
              name='endDate'
              label='End Date'
              formik={formik}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <FormikTextField
              name='description'
              label='Description'
              formik={formik}
              multiline
              minRows={4}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <Button
            color='primary'
            onClick={handleSubmit}
            variant='contained'
          >
            Save
          </Button>
          <Button
            onClick={handleCancel}
            variant='outlined'
          >
            Cancel
          </Button>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDialog;
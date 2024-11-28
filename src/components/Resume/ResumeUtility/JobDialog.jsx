import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid2, IconButton, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import FormikDateField from '../../FormikDateField/FormikDateField';
import FormikTextField from '../../FormikTextField/FormikTextField';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import * as Yup from 'yup';

const initialValues = {
  id: null,
  startDate: null,
  endDate: null,
  company: '',
  jobTitle: '',
  description: '',
  skills: []
};

const validationSchema = Yup.object().shape({
  company: Yup.string().required('Required'),
  startDate: Yup.date().required('Required'),
  endDate: Yup.date().notRequired().min(
    Yup.ref('startDate'),
    'End date cannot be before start date.'
  ),
  skills: Yup.array().of(Yup.object().shape({
    skill: Yup.string().required('Cannot add an empty skill')
  }))
});

const JobDialog = ({ open, job, onSave, onCancel }) => {
  const formik = useFormik({
    initialValues: job || initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      onSave(values);
      formik.resetForm();
    }
  });

  const { handleSubmit, resetForm, values, setFieldValue } = formik;

  const handleCancel = () => {
    onCancel();
    resetForm();
  };

  const handleAddSkill = () => {
    setFieldValue('skills', [...values.skills, { skill: '', id: Math.random().toString(36) }]);
  };

  const handleDeleteSkill = (skill) => {
    setFieldValue('skills', [...values.skills.filter(s => s.id !== skill.id)]);
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        Job Editor
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={1} my={1}>
          <Grid2 size={{ xs: 12 }} mb={1}>
            <FormikTextField
              name='company'
              label='Company'
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
          <Grid2 size={{ xs: 12 }} mb={1}>
            <FormikTextField
              name='jobTitle'
              label='Job Title'
              formik={formik}
              charLimit={255}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }} mb={1}>
            <FormikTextField
              name='description'
              label='Job Description'
              formik={formik}
              multiline
              minRows={4}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }} display='flex' justifyContent='space-between' alignItems='center'>
            <Typography>Skills</Typography>
            <IconButton
              color='primary'
              onClick={handleAddSkill}
            >
              <AddIcon />
            </IconButton>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Divider />
          </Grid2>
          <Grid2 size={{ xs: 12 }} maxHeight={300} overflow='auto'>
            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
              {values.skills.map((skill, index) => (
                <Box key={skill.id} display='flex' justifyContent='center' width='100%' alignItems='top' my={1}>
                  <FormikTextField
                    name={`skills[${index}].skill`}
                    label=''
                    formik={formik}
                  />
                  <Box ml={1}>
                    <IconButton
                      color='error'
                      onClick={() => handleDeleteSkill(skill)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid2>
        </Grid2>
      </DialogContent>
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
    </Dialog>
  );
};

export default JobDialog;
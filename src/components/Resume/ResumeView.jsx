import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useLoading } from '../../lib/LoadingContext';
import { useSnackbar } from 'notistack';
import sandboxService from '../../lib/SandboxService';
import { Avatar, Box, Card, Chip, Divider, Grid2, IconButton, Stack, Step, StepContent, StepLabel, Stepper, Tooltip, Typography } from '@mui/material';
import { useCurrentUser } from '../../lib/UserContext';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import FormikTextField from '../FormikTextField/FormikTextField';
import JobDialog from './ResumeUtility/JobDialog';
import EducationDialog from './ResumeUtility/EducationDialog';

const initialValues = {
  id: null,
  name: '',
  title: '',
  blurb: '',
  resumeNickname: '',
  isPrimary: false,
  jobs: [],
  education: [],
  skills: [],
  projects: []
};

const removeIds = (ele) => {
  if (ele.id.length < 36) {
    return { ...ele, id: null }
  }
  return ele;
};

const removeGeneratedIds = (resume) => {
  const temp = { ...resume };
  temp.jobs = temp.jobs.map(job => ({ ...removeIds(job), skills: job.skills.map(removeIds) }));
  temp.projects = temp.projects.map(removeIds);
  temp.skills = temp.skills.map(removeIds);
  temp.education = temp.education.map(removeIds);
  return temp;
};

const ResumeView = ({ id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();
  const { isAdmin } = useCurrentUser();
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        startLoading();
        let data = {};
        if (values.id) {
          data = await sandboxService.put(`/resumes/${values.id}`, removeGeneratedIds(values));
        } else {
          data = await sandboxService.post('/resumes', removeGeneratedIds(values));
        }
        formik.setValues(data);
        enqueueSnackbar('Resume saved!', { variant: 'success' });
        setIsEditing(false);
      } catch (error) {
        console.error('An error occurred while saving the resume.', error);
        enqueueSnackbar('An error occurred while saving the resume.', { variant: 'error' });
      } finally {
        stopLoading();
      }
    }
  });
  const { setValues, values, isSubmitting, handleSubmit, setFieldValue } = formik;

  const fetchResume = useCallback(async () => {
    if (!id) {
      setValues(initialValues);
      return;
    }
    try {
      startLoading();
      const data = await sandboxService.get(`/resumes/${id}`);
      setValues(data);
    } catch (error) {
      console.error('An error occurred while fetching the resume.', error);
      enqueueSnackbar('An error occurred while fetching the resume.', { variant: 'error' });
    } finally {
      stopLoading();
    }
  }, [id, setValues, enqueueSnackbar]);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {

  };

  const handleRevert = () => {
    setIsEditing(false);
    fetchResume();
  };

  const handleAddJob = () => {
    setSelectedJob(null);
    setJobDialogOpen(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setJobDialogOpen(true);
  };

  const handleDeleteJob = (job) => {
    setFieldValue('jobs', [...values.jobs.filter(j => j.id !== job.id)]);
  };

  const handleJobDialogCancel = () => {
    setJobDialogOpen(false);
    setSelectedJob(null);
  };

  const handleAddEducation = () => {
    setSelectedEducation(null);
    setEducationDialogOpen(true)
  };

  const handleEducationDialogCancel = () => {
    setEducationDialogOpen(false);
    setSelectedEducation(null);
  };

  const handleEditEducation = (education) => {
    setSelectedEducation(education);
    setEducationDialogOpen(true);
  };

  const handleDeleteEducation = (education) => {
    setFieldValue('education', [...values.education.filter(e => e.id !== education.id)]);
  };

  const handleEducationDialogSave = (education) => {
    if (education.id) {
      setFieldValue('education', [
        ...values.education.filter(e => e.id !== education.id),
        education
      ].sort((a, b) => b.startDate - a.startDate));
    } else {
      setFieldValue('education', [...values.education, { ...education, id: Math.random().toString(36) }]);
    }
    setEducationDialogOpen(false);
    setSelectedEducation(null);
  };

  const handleJobDialogSave = (job) => {
    if (job.id) {
      setFieldValue('jobs', [
        ...values.jobs.filter(j => j.id !== job.id),
        job,
      ].sort((a, b) => b.startDate - a.startDate));
    } else {
      setFieldValue('jobs', [...values.jobs, { ...job, id: Math.random().toString(36) }]);
    }
    setJobDialogOpen(false);
    setSelectedJob(null);
  };

  return (
    <Grid2 container spacing={1}>
      {isAdmin &&
        <>
          <Grid2 size={{ xs: 12 }} display='flex' justifyContent={isEditing ? 'space-between' : 'right'} px={1} py={0.5} component={Card}>
            {!isEditing &&
              <Tooltip title='Edit Resume'>
                <IconButton
                  color='primary'
                  onClick={handleEdit}
                  disabled={isSubmitting || isLoading}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            }
            {isEditing &&
              <>
                <Tooltip title='Cancel'>
                  <IconButton
                    color='error'
                    onClick={handleRevert}
                    disabled={isSubmitting || isLoading}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
                <Box>
                  <Tooltip title='Delete'>
                    <IconButton
                      color='error'
                      onClick={handleDelete}
                      disabled={values.isPrimary || isSubmitting || isLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Save'>
                    <IconButton
                      color='primary'
                      onClick={handleSubmit}
                      disabled={isSubmitting || isLoading}
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            }
          </Grid2>
          {isEditing &&
            <Grid2 size={{ xs: 12 }} display='flex' justifyContent='center' mb={1}>
              <FormikTextField
                name='resumeNickname'
                label='Resume Nickname'
                formik={formik}
                disabled={isSubmitting || isLoading}
                sx={{ my: 1 }}
              />
            </Grid2>
          }
        </>
      }
      <Grid2 size={{ xs: 12 }} display='flex' justifyContent='center'>
        <Avatar />
      </Grid2>
      <Grid2 size={{ xs: 12 }} display='flex' justifyContent='center'>
        {isEditing &&
          <FormikTextField
            name='name'
            label='Name'
            formik={formik}
            disabled={isSubmitting || isLoading}
            sx={{ my: 1 }}
          />
        }
        {!isEditing &&
          <Typography textAlign='center'>{values?.name}</Typography>
        }
      </Grid2>
      <Grid2 size={{ xs: 12 }} display='flex' justifyContent='center'>
        {isEditing &&
          <FormikTextField
            name='title'
            label='Title'
            formik={formik}
            disabled={isSubmitting || isLoading}
            sx={{ my: 1 }}
          />
        }
        {!isEditing &&
          <Typography textAlign='center' variant='caption'>{values?.title}</Typography>
        }
      </Grid2>
      <Grid2 size={{ xs: 12 }} display='flex' justifyContent='center'>
        {isEditing &&
          <FormikTextField
            name='blurb'
            label='Blurb/Bio'
            formik={formik}
            minRows={6}
            multiline
            disabled={isSubmitting || isLoading}
            sx={{ my: 1 }}
          />
        }
        {!isEditing &&
          <Typography textAlign='center' variant='caption'>{values?.blurb}</Typography>
        }
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }} display='flex' flexDirection='column' alignItems='center' justifyContent='top'>
        <Stepper orientation='vertical'>
          {values.jobs.map(job => (
            <Step key={job.id} active>
              <StepLabel slotProps={{ stepIcon: { icon: <WorkIcon /> } }}>
                <Box display='flex' justifyContent='left'>
                  <Typography variant='h6'>{job.company}</Typography>
                  {isEditing &&
                    <>
                      <Box ml={1}>
                        <IconButton
                          color='primary'
                          onClick={() => handleEditJob(job)}
                          disabled={isSubmitting || isLoading}
                          size='small'
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                      <Box>
                        <IconButton
                          color='error'
                          onClick={() => handleDeleteJob(job)}
                          disabled={isSubmitting || isLoading}
                          size='small'
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </>
                  }
                </Box>
                <Typography variant='caption' fontStyle='italic'>{job.startDate} - {job.endDate || 'Present'}</Typography>
              </StepLabel>
              <StepContent>
                <Box display='flex' flexDirection='column' justifyContent='left' alignItems='left'>
                  <Typography>{job.jobTitle}</Typography>
                  <Typography variant='caption'>{job.description}</Typography>
                  <Stack direction='row' flexWrap='wrap' gap={1} mt={1}>
                    {job.skills.map(skill => (
                      <Chip color='primary' label={skill.skill} key={skill.id} />
                    ))}
                  </Stack>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {isEditing &&
          <Box my={1}>
            <IconButton
              color='primary'
              onClick={handleAddJob}
              disabled={isSubmitting || isLoading}
            >
              <AddIcon />
            </IconButton>
          </Box>
        }
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }} display='flex' flexDirection='column' alignItems='center' justifyContent='top'>
        <Stepper orientation='vertical'>
          {values.education.map(education => (
            <Step key={education.id} active>
              <StepLabel slotProps={{ stepIcon: { icon: <SchoolIcon /> } }}>
                <Box display='flex' justifyContent='left'>
                  <Typography variant='h6'>{education.schoolName}</Typography>
                  {isEditing &&
                    <>
                      <Box ml={1}>
                        <IconButton
                          color='primary'
                          onClick={() => handleEditEducation(education)}
                          disabled={isSubmitting || isLoading}
                          size='small'
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                      <Box>
                        <IconButton
                          color='error'
                          onClick={() => handleDeleteEducation(education)}
                          disabled={isSubmitting || isLoading}
                          size='small'
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </>
                  }
                </Box>
                <Typography variant='caption' fontStyle='italic'>{education.startDate} - {education.endDate || 'Present'}</Typography>
              </StepLabel>
              <StepContent>
                <Typography>{education.type}</Typography>
                <Typography variant='caption'>{education.description}</Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {isEditing &&
          <Box my={1}>
            <IconButton
              color='primary'
              onClick={handleAddEducation}
              disabled={isSubmitting || isLoading}
            >
              <AddIcon />
            </IconButton>
          </Box>
        }
      </Grid2>
      <JobDialog
        open={jobDialogOpen}
        onCancel={handleJobDialogCancel}
        onSave={handleJobDialogSave}
        job={selectedJob}
      />
      <EducationDialog
        open={educationDialogOpen}
        onCancel={handleEducationDialogCancel}
        onSave={handleEducationDialogSave}
        education={selectedEducation}
      />
    </Grid2>
  );
};

export default ResumeView;
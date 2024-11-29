import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Clear';
import ProjectIcon from '@mui/icons-material/Construction';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import WorkIcon from '@mui/icons-material/Work';
import { Avatar, Box, Card, Chip, Grid2, IconButton, Stack, Step, StepContent, StepLabel, Stepper, Tooltip, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useLoading } from '../../lib/LoadingContext';
import sandboxService from '../../lib/SandboxService';
import { useCurrentUser } from '../../lib/UserContext';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import FormikTextField from '../FormikTextField/FormikTextField';
import EducationDialog from './ResumeUtility/EducationDialog';
import JobDialog from './ResumeUtility/JobDialog';
import ProjectDialog from './ResumeUtility/ProjectDialog';

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

const validationSchema = Yup.object().shape({
  resumeNickname: Yup.string().required('Required'),
  name: Yup.string().required('Required'),
  title: Yup.string().required('Required')
});

const ResumeView = ({ id, onUpdate, onDelete, onCreate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hoveringPrimary, setHoveringPrimary] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();
  const { isAdmin } = useCurrentUser();
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        startLoading();
        let data = {};
        if (values.id) {
          data = await sandboxService.put(`/admin/resumes/${values.id}`, removeGeneratedIds(values));
        } else {
          data = await sandboxService.post('/admin/resumes', removeGeneratedIds(values));
        }
        formik.setValues(data);
        enqueueSnackbar('Resume saved!', { variant: 'success' });
        setIsEditing(false);
        onUpdate();
        onCreate(data.id);
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
      let data = {};
      if (id !== 'primary') {
        data = await sandboxService.get(`/admin/resumes/${id}`);
      } else {
        data = await sandboxService.get('/resumes/primary');
      }
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

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      startLoading();
      await sandboxService.delete(`/admin/resumes/${values.id}`, values);
      setDeleteDialogOpen(false);
      onDelete();
    } catch (error) {
      console.error('An error occured while deleting the resume.', error);
      enqueueSnackbar('An error occured while deleting the resume.', { variant: 'error' });
    } finally {
      stopLoading();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
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

  const handleProjectDialogCancel = () => {
    setProjectDialogOpen(false);
    setSelectedProject(null);
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setProjectDialogOpen(true);
  };

  const handleDeleteProject = (project) => {
    setFieldValue('projects', [...values.projects.filter(p => p.id !== project.id)]);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setProjectDialogOpen(true);
  };

  const handleAddSkill = () => {
    setFieldValue('skills', [...values.skills, { skill: '', id: Math.random().toString(36) }]);
  };

  const handleDeleteSkill = (skill) => {
    setFieldValue('skills', [...values.skills.filter(s => s.id !== skill.id)]);
  };

  const handlePrimaryMouseEnter = () => {
    setHoveringPrimary(true);
  };

  const handlePrimaryMouseLeave = () => {
    setHoveringPrimary(false);
  };

  const handleMakePrimary = () => {
    setFieldValue('isPrimary', true);
    handleSubmit();
  };

  const handleProjectDialogSave = (project) => {
    if (project.id) {
      setFieldValue('projects', [
        ...values.projects.filter(p => p.id !== project.id),
        project
      ].sort((a, b) => b.startDate - a.startDate));
    } else {
      setFieldValue('projects', [...values.projects, { ...project, id: Math.random().toString(36) }]);
    }
    setProjectDialogOpen(false);
    setSelectedProject(null);
  }

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
    <Grid2 container spacing={1} mb={2}>
      {isAdmin &&
        <>
          <Grid2
            size={{ xs: 12 }}
            display='flex'
            justifyContent={'space-between'}
            px={1}
            py={0.5}
            component={Card}
            alignItems='center'
            mb={1}
          >
            {!isEditing &&
              <>
                <Tooltip title='Make Primary'>
                  <IconButton
                    color='primary'
                    onClick={handleMakePrimary}
                    onMouseEnter={handlePrimaryMouseEnter}
                    onMouseLeave={handlePrimaryMouseLeave}
                    disabled={isSubmitting || isLoading || values.isPrimary || !values.id}
                  >
                    {(hoveringPrimary || values.isPrimary) ? <StarIcon /> : <StarOutlineIcon />}
                  </IconButton>
                </Tooltip>
                <Box>
                  <Typography>{values.resumeNickname || 'New Resume'}</Typography>
                </Box>
                <Tooltip title='Edit Resume'>
                  <IconButton
                    color='primary'
                    onClick={handleEdit}
                    disabled={isSubmitting || isLoading}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </>
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
                      disabled={values.isPrimary || isSubmitting || isLoading || !values.id}
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
          <Typography textAlign='center' variant='h5'>{values?.name}</Typography>
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
          <Typography textAlign='center'>{values?.title}</Typography>
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
      {(values.skills.length > 0 || isEditing) &&
        <Grid2
          size={{ xs: 12 }}
          display='flex'
          flexDirection='column'
          alignItems='left'
          justifyContent='top'
          component={Card}
          p={1}
        >
          <Box
            display='flex'
            justifyContent={isEditing ? 'space-between' : 'center'}
            width='100%'
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            pb={isEditing && 0.5}
            mb={isEditing && 0.5}
            alignItems='center'

          >
            <Typography variant='h6'>Primary Skills</Typography>
            {isEditing &&
              <IconButton
                color='primary'
                onClick={handleAddSkill}
                disabled={isSubmitting || isLoading}
              >
                <AddIcon />
              </IconButton>
            }
          </Box>
          {!isEditing &&
            <Stack direction='row' flexWrap='wrap' gap={1} mt={1} justifyContent='center'>
              {values.skills.map(skill => (
                <Chip color='primary' label={skill.skill} key={skill.id} />
              ))}
            </Stack>
          }
          {isEditing &&
            <>
              {values.skills.map((skill, index) => (
                <Box display='flex' key={skill.id} my={1}>
                  <FormikTextField
                    name={`skills[${index}].skill`}
                    label=''
                    formik={formik}
                    charLimit={255}
                  />
                  <Box ml={1}>
                    <IconButton
                      color='error'
                      onClick={() => handleDeleteSkill(skill)}
                      disabled={isSubmitting || isLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </>
          }
        </Grid2>
      }
      <Grid2
        size={{ xs: 12, md: 6 }}
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='top'
        component={Card}
        p={1}
      >
        <Box
          display='flex'
          justifyContent='left'
          width='100%'
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Typography variant='h6'>Work Experience</Typography>
        </Box>
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
      <Grid2
        size={{ xs: 12, md: 6 }}
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='top'
        component={Card}
        p={1}
      >
        <Box
          display='flex'
          justifyContent='left'
          width='100%'
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Typography variant='h6'>Education</Typography>
        </Box>
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
      <Grid2
        size={{ xs: 12 }}
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='top'
        component={Card}
        p={1}
      >
        <Box
          display='flex'
          justifyContent='left'
          width='100%'
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Typography variant='h6'>Projects</Typography>
        </Box>
        <Stepper orientation='vertical'>
          {values.projects.map(project => (
            <Step key={project.id} active>
              <StepLabel slotProps={{ stepIcon: { icon: <ProjectIcon /> } }}>
                <Box display='flex' justifyContent='left'>
                  <Typography variant='h6'>{project.name}</Typography>
                  {isEditing &&
                    <>
                      <Box ml={1}>
                        <IconButton
                          color='primary'
                          onClick={() => handleEditProject(project)}
                          disabled={isSubmitting || isLoading}
                          size='small'
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                      <Box>
                        <IconButton
                          color='error'
                          onClick={() => handleDeleteProject(project)}
                          disabled={isSubmitting || isLoading}
                          size='small'
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </>
                  }
                </Box>
                <Typography variant='caption' fontStyle='italic'>{project.startDate} - {project.endDate || 'Present'}</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant='caption'>{project.description}</Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {isEditing &&
          <Box my={1}>
            <IconButton
              color='primary'
              onClick={handleAddProject}
              disabled={isSubmitting || isLoading}
            >
              <AddIcon />
            </IconButton>
          </Box>
        }
      </Grid2>
      {(!isEditing && values.lastUpdatedDate) &&
        <Grid2
          size={{ xs: 12 }}
          display='flex'
          justifyContent='center'
        >
          <Typography variant='caption' fontStyle='italic'>
            {`Last updated ${values.lastUpdatedDate}.`}
          </Typography>
        </Grid2>
      }
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
      <ProjectDialog
        open={projectDialogOpen}
        onCancel={handleProjectDialogCancel}
        onSave={handleProjectDialogSave}
        project={selectedProject}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        title='Delete Resume'
        confirmButtonText='Delete'
        confirmButtonProps={{
          color: 'error',
          startIcon: <DeleteIcon />
        }}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        showWarningIcon
        asyncConfirm
      >
        <Typography>Are you sure you want to delete this resume? This cannot be undone.</Typography>
      </ConfirmationDialog>
    </Grid2>
  );
};

export default ResumeView;
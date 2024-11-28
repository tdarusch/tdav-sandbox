import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import sandboxService from '../../lib/SandboxService';
import { Box } from '@mui/material';
import { useLoading } from '../../lib/LoadingContext';
import { useCurrentUser } from '../../lib/UserContext';

const LoginHandler = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const { startLoading, stopLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();
  const { setAdmin, logIn } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (code) {
        try {
          startLoading();
          const { token, admin } = await sandboxService.post('/auth/github', { code });
          localStorage.setItem("jwtToken", token);
          setAdmin(admin);
          logIn();
        } catch (error) {
          console.error('An error occurred while logging you in.', error);
          enqueueSnackbar('An error occurred while logging you in.', { variant: error });
        } finally {
          stopLoading();
          navigate('/');
        }
      }
    })();
  }, [code, enqueueSnackbar]);
  
  return(
    <></>
  );
};

export default LoginHandler;
import { AppBar, Box, Button, Container, Divider, Drawer, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { makeStyles } from '@mui/styles';
import { useLoading } from '../../lib/LoadingContext';
import { useCurrentUser } from '../../lib/UserContext';
import BuildIcon from '@mui/icons-material/BuildCircle';

const drawerWidth = 240;

const navRoutes = [
  {
    label: 'Home',
    route: '/',
    secured: false
  },
  {
    label: 'Resume',
    route: '/resume',
    secured: false
  },
  {
    label: 'Contact',
    route: '/contact',
    secured: false
  },
  {
    label: 'Messages',
    route: '/messages',
    secured: true
  }
];

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar
}));

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const container = window.document.body;
  const { toolbar } = useStyles();
  const { isLoading } = useLoading();
  const { isAdmin, isLoggedIn, logOut } = useCurrentUser();
  const { pathname } = useLocation();

  const handleDrawerToggle = () => {
    setDrawerOpen(prevState => !prevState);
  };

  const handleRoute = (route) => {
    setDrawerOpen(false);
    navigate(route);
  };

  const handleSignIn = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
    const redirectUri = `${window.location.origin}/oauth/callback`;
    const scope = 'read:user'
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    logOut();
    navigate('/')
  };

  const handleTabChange = (_, route) => {
    if (route === 'login') {
      if (isLoggedIn) {
        handleSignOut();
      } else {
        handleSignIn();
      }
    } else {
      handleRoute(route);
    }
  };

  const filterRoutes = (route) => {
    return (!route.secured || isAdmin);
  };

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const mobileDrawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box display='flex' justifyContent='center' alignItems='center' my={1}>
        <Typography variant='h6' sx={{ alignItems: 'center' }}>
          Sandbox
        </Typography>
        <Box display='flex' ml={1}>
          <BuildIcon color='primary'/>
        </Box>
      </Box>
      <Divider />
      <List>
        {navRoutes.filter(filterRoutes).map(({ label, route }) => (
          <ListItem key={label} disableGutters disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => { handleRoute(route) }}>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disableGutters disablePadding onClick={isLoggedIn ? handleSignOut : handleSignIn}>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary={isLoggedIn ? 'Sign Out' : 'Sign In'} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box display='flex' height='100%' width='100%'>
      <AppBar component='nav'>
        <Toolbar variant='dense'>
          <IconButton
            color='inherit'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6' 
            component='div'
            sx={{ 
              flexGrow: 1, 
              alignItems: 'center',
              display: { xs: 'none', sm: 'flex' } 
            }}
          >
            Sandbox
            <Box display='flex' ml={1}>
              <BuildIcon color='primary'/>
            </Box>
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, maxWidth: 450 }}>
            <Tabs
              value={pathname}
              onChange={handleTabChange}
              variant='scrollable'
              scrollButtons
              TabIndicatorProps={{
                hidden: true
              }}
            >
              {navRoutes.filter(filterRoutes).map(({ label, route }, index) => (
                <Tab label={label} value={route} key={index} />
              ))}
              <Tab
                label={isLoggedIn ? 'Sign Out' : 'Sign In'}
                value='login'
              />
            </Tabs>
          </Box>
        </Toolbar>
        {isLoading && <LinearProgress />}
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant='temporary'
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {mobileDrawer}
        </Drawer>
      </nav>
      <div className={toolbar} />
      <Box width='100%'>
        <Toolbar variant='dense' />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Navigation;
import { AppBar, Box, Button, Container, Divider, Drawer, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from 'react-router';
import { makeStyles } from '@mui/styles';
import { useLoading } from '../../lib/LoadingContext';

const drawerWidth = 240;

const navRoutes = [
  {
    label: 'Home',
    route: '/'
  },
  {
    label: 'Contact',
    route: '/contact'
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

  const handleDrawerToggle = () => {
    setDrawerOpen(prevState => !prevState);
  };

  const handleRoute = (route) => {
    setDrawerOpen(false);
    navigate(route);
  };

  const mobileDrawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant='h6'>TDAV Sandbox</Typography>
      <Divider />
      <List>
        {navRoutes.map(({ label, route }) => (
          <ListItem key={label}>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => {handleRoute(route)}}>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return(
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
          <Typography variant='h6' component='div' sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            TDAV Sandbox
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navRoutes.map(({label, route}) => (
              <Button key={label} sx={{ color: '#fff' }} onClick={() => {handleRoute(route)}}>
                {label}
              </Button>
            ))}
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
        <Toolbar variant='dense'/>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Navigation;
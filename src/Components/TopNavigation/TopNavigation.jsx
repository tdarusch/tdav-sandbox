import React from 'react';
import { Tab, TabList, Tabs, Box, Avatar } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router';
import { useMatch } from 'react-router-dom';

import logo from '../../../public/sandbox.svg';
import Home from '../Home/Home';

const tabs = [
  {
    label: 'Home',
    route: '/'
  },
  {
    label: 'Portfolio',
    route: '/portfolio'
  },
  {
    label: 'Sandbox',
    route: '/sandbox'
  },
  {
    label: 'Documentation',
    route: '/documentation'
  },
  {
    label: 'Contact',
    route: '/contact'
  }
];

const TopNavigation = () => {
  const navigate = useNavigate();
  const isRoot = useMatch('/');
  
  return(
    <>
      <Box
        display='flex'
        alignItems='center'
        borderBottom='1px solid'
        borderColor='gray.200'
      >
        <Avatar src={logo} ml={2}/>
        <Tabs 
          size='lg' 
          align='center' 
          colorScheme='blue'
          variant='unstyled'
          p={2}
        >
          <TabList>
            {tabs.map((tab, index) => (
              <Tab 
                key={index}
                color='gray.400'
                _selected={{ color: 'gray.700' }}
                onClick={() => navigate(tab.route)} 
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Box>
      <>
        {isRoot 
          ? <Home />
          : <Outlet />
        }
      </>
    </>
  );
};

export default TopNavigation;
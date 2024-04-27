import { useEffect } from 'react';
import { Container, Tab, TabList, Tabs, Box, Avatar, TabIndicator } from '@chakra-ui/react';
import React from 'react';
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
    label: 'Contact',
    route: '/contact'
  }
]

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
              <Tab onClick={() => navigate(tab.route)} key={index}>
                {tab.label}
              </Tab>
            ))}
          </TabList>
          <TabIndicator mt='-1.5px' height='2px' bg='gray.300' borderRadius='1px' />
        </Tabs>
      </Box>
      <Container centerContent mt={2}>
        {isRoot 
          ? <Home />
          : <Outlet />
        }
      </Container>
    </>
  );
};

export default TopNavigation;
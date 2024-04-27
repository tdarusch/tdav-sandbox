import React from 'react';
import { 
  Tab, 
  TabList, 
  TabPanels, 
  Tabs, 
  TabPanel 
} from '@chakra-ui/react';

//Projects
import Poker from './Projects/Poker/Poker';
import Blackjack from './Projects/Blackjack/Blackjack';
import Chess from './Projects/Chess/Chess';

const projects = [
  {
    label: 'Poker',
    component: <Poker />
  },
  {
    label: 'Blackjack',
    component: <Blackjack />
  },
  {
    label: 'Chess',
    component: <Chess />
  }
]

const Sandbox = () => {
 
  return(
    <Tabs
      colorScheme='blue'
      variant='unstyled'
      orientation='vertical'
      textAlign='left'
      top={67} 
      bottom={0}
      width='100%'
      position='fixed'
    >
      <TabList width='15%' minWidth='200px' >
        {projects.map((project, index) => (
          <Tab
            key={index}
            _selected={{ color: 'gray.700' }}
            justifyContent='stretch'
            color='gray.400'
            textAlign='left'
            ml={3}
          >
            {project.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels borderLeft='1px solid' borderColor='gray.200'>
        {projects.map((project, index) => (
          <TabPanel key={index} py={2} px={3}>
            {project.component}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default Sandbox;
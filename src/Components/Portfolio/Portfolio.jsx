import React from 'react';
import PageContainer from '../PageContainer/PageContainer';
import { VStack, Text, Divider, Box, Wrap, Tag } from '@chakra-ui/react';

//Need API call here
import projects from './mockData.json';
import SectionHeading from '../SectionHeading/SectionHeading';

const Portfolio = () => {
  
  return(
    <PageContainer disableCenter={true}>
       {projects.map(project => (
        <VStack justifyContent='left' alignItems='left'>
          <SectionHeading hideDivider={true} text={project.title} />
          <Text>{project.subtitle}</Text>
          <Divider color='gray.400' />
          {project.description.map(paragraph => <Text>{paragraph.content}</Text>)}
          <Wrap mt={1}>
            {project.technologies?.map((technology) => (
              <Tag bgColor='blue.300' color='white'>{technology.name}</Tag>
            ))}
          </Wrap>
        </VStack>
       ))}
    </PageContainer>
  );
};

export default Portfolio;
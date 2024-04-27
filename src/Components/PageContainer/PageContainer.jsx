import { Container } from '@chakra-ui/react';
import React from 'react';

const PageContainer = ({ disableCenter, ...props}) => {
  
  return(
    <Container 
      w='80%' 
      maxW={1280} 
      centerContent={!disableCenter}
      py={3}
    >
      {props.children}
    </Container>
  );
};

export default PageContainer;
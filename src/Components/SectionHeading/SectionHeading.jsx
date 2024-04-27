import React from 'react';
import { Heading, Divider } from '@chakra-ui/react';

const SectionHeading = ({ text, hideDivider }) => {
  
  return(
    <>
      <Heading as='h3' size='lg'>{text}</Heading>
      {!hideDivider && <Divider color='gray.400' />}
    </>
  );
};

export default SectionHeading;
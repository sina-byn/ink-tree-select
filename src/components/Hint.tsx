import React from 'react';
import { Box, Newline, Text } from 'ink';

const Hint = () => {
  return (
    <Box flexDirection='column'>
      <Text color='blueBright'>
        Instructions:
        <Newline />
        [Enter]: Choose path
        <Newline />
        [&#x2191; / &#x2193;]: Move pointer
      </Text>
    </Box>
  );
};

export default Hint;
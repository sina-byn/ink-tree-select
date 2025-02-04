import React from 'react';
import { Box, render } from 'ink';

// * utils
import { createDirectoryTree } from './utils/index.js';

const App = () => {
  console.log(createDirectoryTree('./', '.'));

  return <Box></Box>;
};

render(<App />);

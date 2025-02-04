import React from 'react';
import { Box, render } from 'ink';

// * utils
import { createDirectoryTree, stringifyTree } from './utils/index.js';

const App = () => {
  const tree = createDirectoryTree('./', '.');
  console.log(stringifyTree(tree));

  return <Box></Box>;
};

render(<App />);

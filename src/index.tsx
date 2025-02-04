import React from 'react';
import { Box, render } from 'ink';

// * utils
import { createDirectoryTree, stringifyBranches } from './utils/index.js';

const App = () => {
  const tree = createDirectoryTree('./', '.');
  console.log(stringifyBranches(tree.branches));

  return <Box></Box>;
};

render(<App />);

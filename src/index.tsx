import React from 'react';
import { Box, render } from 'ink';

// * utils
import { createDirectoryTree, flattenTree, stringifyTree } from './utils/index.js';

const App = () => {
  const tree = createDirectoryTree('./', '.');
  console.log(stringifyTree(tree));
  console.log(flattenTree(tree));

  return <Box></Box>;
};

render(<App />);

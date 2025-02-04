import { render, Text } from 'ink';
import React, { useState } from 'react';

// * components
import { TreeSelect } from './components/TreeSelect.js';

const App = () => {
  const [selectedPath, setSelectedPath] = useState<string>('');
  const selectHandler = (path: string) => setSelectedPath(path);

  return (
    <>
      <TreeSelect root='./' onSelect={selectHandler} />
      {selectedPath.length > 0 && <Text>{selectedPath}</Text>}
    </>
  );
};

render(<App />);

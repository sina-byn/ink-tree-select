import React from 'react';
import { render } from 'ink';

// * components
import TreeSelect from './components/TreeSelect.js';

const App = () => {
  return <TreeSelect onSelect={activePath => console.log(activePath)} />;
};

render(<App />);

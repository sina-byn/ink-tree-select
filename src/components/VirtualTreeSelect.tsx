import { Box, Text, useInput } from 'ink';
import React, { useMemo, useState, useEffect } from 'react';

// * utils
import { flattenTree, stringifyTree } from '../utils/index.js';

// * components
import Hint from './Hint.js';

// * types
import type { VirtualTreeSelectProps } from '../types/index.js';

export const VirtualTreeSelect = ({
  tree,
  onChange,
  onSelect,
  options = {},
}: VirtualTreeSelectProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selected, setSelected] = useState<boolean>(false);
  const { previewColor, indicatorColor } = options;

  const flattenedTree = useMemo(() => flattenTree(tree).slice(1), [tree]);
  const activePath = flattenedTree[activeIndex]!;
  const maxIndex = flattenedTree.length - 1;

  useEffect(() => {
    onChange?.(activePath);
  }, [activePath]);

  useInput(
    (_, key) => {
      if (key.return) {
        setSelected(true);
        onSelect?.(activePath);
        return;
      }

      if (key.upArrow) return setActiveIndex(prev => Math.max(0, --prev));
      if (key.downArrow) return setActiveIndex(prev => Math.min(++prev, maxIndex));
    },
    { isActive: !selected }
  );

  return (
    <Box flexDirection='column' rowGap={1}>
      <Hint />
      <Text>{stringifyTree(tree, activePath, indicatorColor)}</Text>
      <Text color={previewColor ?? 'blue'}>{activePath}</Text>
    </Box>
  );
};

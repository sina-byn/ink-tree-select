import { Box, Text, useInput, type TextProps } from 'ink';
import React, { useEffect, useMemo, useState } from 'react';

// * utils
import { flattenTree, stringifyTree, createDirectoryTree } from '../utils/index.js';

// * types
type Color = TextProps['color'];

type TreeSelectProps = {
  options?: TreeSelectOptions;
  onChange?: (activePath: string) => void;
  onSelect?: (activePath: string) => void;
};

type TreeSelectOptions = Partial<{
  ignore: string[];
  rootAlias: string;
  previewColor: Color;
  indicatorColor: Color;
}>;

const TreeSelect = ({ onChange, onSelect, options = {} }: TreeSelectProps) => {
  const { ignore, rootAlias, previewColor, indicatorColor } = options;
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selected, setSelected] = useState<boolean>(false);

  const tree = useMemo(() => createDirectoryTree('./', { rootAlias, ignore }), []); // ! add root to deps
  const flattenedTree = useMemo(() => flattenTree(tree), []); // ! add root to deps
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
      <Text dimColor color={indicatorColor}>
        {stringifyTree(tree, activePath)}
      </Text>
      <Text dimColor color={previewColor ?? 'blue'}>
        {activePath}
      </Text>
    </Box>
  );
};

export default TreeSelect;

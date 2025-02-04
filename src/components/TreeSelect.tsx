import { Box, Text, useInput, type TextProps } from 'ink';
import React, { useMemo, useState, useEffect } from 'react';

// * utils
import { flattenTree, stringifyTree, createDirectoryTree } from '../utils/index.js';

// * types
export type Color = TextProps['color'];

export type TreeSelectProps = {
  root: string;
  options?: TreeSelectOptions;
  onChange?: (activePath: string) => void;
  onSelect?: (selectedPath: string) => void;
};

export type TreeSelectOptions = Partial<{
  ignore: string[];
  rootAlias: string;
  previewColor: Color;
  indicatorColor: Color;
}>;

export const TreeSelect = ({ root, onChange, onSelect, options = {} }: TreeSelectProps) => {
  const { ignore, rootAlias, previewColor, indicatorColor } = options;
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selected, setSelected] = useState<boolean>(false);

  const tree = useMemo(() => createDirectoryTree(root, { rootAlias, ignore }), [root]);
  const flattenedTree = useMemo(() => flattenTree(tree), [root]);
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

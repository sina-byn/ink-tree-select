import React, { useMemo } from 'react';

// * utils
import { createDirectoryTree } from '../utils/index.js';

// * components
import { VirtualTreeSelect } from './VirtualTreeSelect.js';

// * types
import { type ForegroundColorName as Color } from 'chalk';

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
  const tree = useMemo(() => createDirectoryTree(root, { rootAlias, ignore }), [root]);

  return (
    <VirtualTreeSelect
      tree={tree}
      onChange={onChange}
      onSelect={onSelect}
      options={{ previewColor, indicatorColor }}
    />
  );
};

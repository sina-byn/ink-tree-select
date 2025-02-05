import React, { useMemo } from 'react';

// * utils
import { createDirectoryTree } from '../utils/index.js';

// * components
import { VirtualTreeSelect } from './VirtualTreeSelect.js';

// * types
import type { TreeSelectProps } from '../types/inedx.js';

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

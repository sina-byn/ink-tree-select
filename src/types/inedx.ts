import type { ForegroundColorName } from 'chalk';

export type Branches = Tree['branches'];

export type Tree = { name: string; fullPath: string; branches: Tree[]; dir?: boolean };

export type TreeOptions = Partial<{ rootAlias: string; ignore: string[] }>;

export type Color = ForegroundColorName;

export type VirtualTreeSelectOptions = Partial<{
  previewColor: Color;
  indicatorColor: Color;
}>;

export type VirtualTreeSelectProps = {
  tree: Tree;
  options?: VirtualTreeSelectOptions;
  onChange?: (activePath: string) => void;
  onSelect?: (selectedPath: string) => void;
};

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

import fs from 'fs';
import chalk from 'chalk';

// * fast-glob
import fastGlob from 'fast-glob';
const { globSync: fg } = fastGlob;

// * constants
const LF = '\n'; // * Line Feed
const SP = '    '; // * Space
const BR = '├── '; // * Branch
const BRE = '└── '; // * Branch End
const PBR = '│   '; // * Pre Branch

// * types
import type { Tree, Color, Branches, TreeOptions } from '../types/index.js';

export const readDirectory = (root: string, ignore: string[]) => {
  if (!fs.existsSync(root)) throw new Error(`Could not find '${root}'`);
  if (!fs.statSync(root).isDirectory()) throw new Error(`'${root}' is not a directory`);

  const noramlizedRoot = root.replace(/\\/g, '/');
  const pattern = noramlizedRoot + '/**/*';
  const paths = fg(pattern, {
    onlyFiles: false,
    markDirectories: true,
    ignore: ['node_modules/**', ...ignore],
  });

  return paths;
};

export const createDirectoryTree = (root: string, options: TreeOptions = {}) => {
  const { rootAlias = '.', ignore = [] } = options;
  const paths = readDirectory(root, ignore);
  const tree: Tree = { name: rootAlias, dir: true, fullPath: root, branches: [] };

  for (const path of paths) {
    const pathChunks = path.replace(root, '').split('/').filter(Boolean);
    const isDir = path.endsWith('/');
    let subTree = tree.branches;

    for (let i = 0; i < pathChunks.length; i++) {
      const fullPath = ['.', ...pathChunks.slice(0, i + 1)].join('/');
      const chunk = pathChunks[i]!;
      let node = subTree.find(n => n.name === chunk);

      if (!node) {
        node = { name: chunk, dir: isDir, fullPath, branches: [] };
        subTree.push(node);
      }

      subTree = node.branches;
    }
  }

  return tree;
};

export const stringifyBranches = (
  branches: Branches,
  activePath: string,
  color: Color,
  level: number = 0,
  parents: number[] = []
  // * [0, 1] ==> previous parents if 1 parent is the last node of the level
  // * if 1 parent is not the last node of the level
) => {
  if (branches.length === 0) return '';
  const fmt = chalk[color];
  let stringified = '';

  for (let i = 0; i < branches.length; i++) {
    const isLastNode = i === branches.length - 1;
    const node = branches[i]!;
    const isActivePath = activePath === node.fullPath;

    const line = [
      LF,
      ...parents.map(p => (p === 0 ? PBR : SP)),
      isLastNode ? BRE : BR,
      isActivePath ? fmt('\u25CF ') : '',
      isActivePath ? fmt(node.name) : node.name,
      isActivePath ? fmt(node.dir ? '/' : '') : node.dir ? '/' : '',
    ]
      .flat()
      .join('');

    const newParents = [...parents, isLastNode ? 1 : 0];

    stringified += line;
    stringified += stringifyBranches(node.branches, activePath, color, level + 1, newParents);
  }

  return stringified;
};

export const stringifyTree = (tree: Tree, activePath: string, color: Color = 'blue') => {
  return tree.name + stringifyBranches(tree.branches, activePath, color);
};

export const flattenTree = (tree: Tree): string[] => {
  return [tree.fullPath, ...tree.branches.flatMap(flattenTree)];
};

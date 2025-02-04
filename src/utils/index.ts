import fs from 'fs';

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
type Branches = Tree['branches'];

type Tree = { name: string; fullPath: string; branches: Tree[]; dir?: boolean };

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

export const createDirectoryTree = (root: string, rootAlias: string, ignore: string[] = []) => {
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
  level: number = 0,
  isParentLastNode: boolean = false
) => {
  if (branches.length === 0) return '';
  let stringified = '';

  for (let i = 0; i < branches.length; i++) {
    const isLastNode = i === branches.length - 1;
    const node = branches[i]!;

    const line = [
      LF,
      isLastNode
        ? isParentLastNode
          ? Array.from({ length: level }, (_, index) => (index < level - 1 ? PBR : SP))
          : Array(level).fill(PBR)
        : Array.from({ length: level }, (_, index) => (index < level ? PBR : SP)),
      isLastNode ? BRE : BR,
      activePath === node.fullPath ? '\u25CF ' : '',
      node.name,
      node.dir ? '/' : '',
    ]
      .flat()
      .join('');

    stringified += line;
    stringified += stringifyBranches(node.branches, activePath, level + 1, isLastNode);
  }

  return stringified;
};

export const stringifyTree = (tree: Tree, activePath: string) => {
  return tree.name + stringifyBranches(tree.branches, activePath);
};

export const flattenTree = (tree: Tree): string[] => {
  if (tree.branches.length === 0) return [tree.name];
  return tree.branches.flatMap(node => flattenTree(node).map(subPath => `${tree.name}/${subPath}`));
};

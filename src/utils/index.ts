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

type Tree = { name: string; dir?: boolean; branches: Tree[] };

export const readDirectory = (root: string, ignore: string[] = []) => {
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

export const createDirectoryTree = (root: string, rootAlias: string) => {
  const paths = readDirectory(root);
  const tree: Tree = { name: rootAlias, dir: true, branches: [] };

  for (const path of paths) {
    const pathChunks = path.replace(root, '').split('/').filter(Boolean);
    const isDir = path.endsWith('/');
    let subTree = tree.branches;

    for (const chunk of pathChunks) {
      let node = subTree.find(n => n.name === chunk);

      if (!node) {
        node = { name: chunk, dir: isDir, branches: [] };
        subTree.push(node);
      }

      subTree = node.branches;
    }
  }

  return tree;
};

export const stringifyBranches = (
  branches: Branches,
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
      node.name,
      node.dir ? '/' : '',
    ]
      .flat()
      .join('');

    stringified += line;
    stringified += stringifyBranches(node.branches, level + 1, isLastNode);
  }

  return stringified;
};

export const stringifyTree = (tree: Tree) => {
  return tree.name + stringifyBranches(tree.branches);
};

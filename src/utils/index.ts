import fs from 'fs';

// * fast-glob
import fastGlob from 'fast-glob';
const { globSync: fg } = fastGlob;

// * types
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

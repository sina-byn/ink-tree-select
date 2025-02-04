import fs from 'fs';

// * fast-glob
import fastGlob from 'fast-glob';
const { globSync: fg } = fastGlob;

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


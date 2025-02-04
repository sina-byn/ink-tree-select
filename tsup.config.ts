import { defineConfig } from 'tsup';

// * constants
const entry = process.env['NODE_ENV'] === 'production' ? 'src/index.ts' : 'src/App.tsx';

export default defineConfig({
  format: 'esm',
  entry: [entry],
  dts: {
    entry,
    resolve: true,
  },
  sourcemap: true,
  clean: true,
  minify: true,
  outDir: 'dist',
  target: 'node16',
  splitting: false,
});

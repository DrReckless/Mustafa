// Web arayüzünü Android uygulamasının assets klasörüne derler.
import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const out = resolve(root, process.env.OUT_DIR || '../android/app/src/main/assets/www');
const watch = process.argv.includes('--watch');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(resolve(root, 'public'), out, { recursive: true });
copyFileSync(resolve(root, 'index.html'), resolve(out, 'index.html'));

const ctx = await esbuild.context({
  entryPoints: { main: resolve(root, 'src/main.js') },
  bundle: true,
  splitting: true,
  format: 'esm',
  outdir: out,
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  target: ['chrome100'],
  chunkNames: 'chunks/[name]-[hash]',
  legalComments: 'none',
  logLevel: 'info',
});
if (watch) await ctx.watch();
else { await ctx.rebuild(); await ctx.dispose(); }

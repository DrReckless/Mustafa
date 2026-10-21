// 3D motoru tek dosyaya paketler: www/js/game3d.js
import { build } from 'esbuild';
await build({
  entryPoints: ['../src/r3d/index.js'],
  bundle: true, minify: true, format: 'iife', target: ['chrome80'],
  outfile: '../www/js/game3d.js', logLevel: 'info',
  nodePaths: [new URL('./node_modules', import.meta.url).pathname]
});

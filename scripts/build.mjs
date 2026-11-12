import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'site.config.js']) {
  await cp(resolve(root, file), resolve(output, file));
}
await cp(resolve(root, 'assets'), resolve(output, 'assets'), { recursive: true });
const html = await readFile(resolve(output, 'index.html'), 'utf8');
if (!html.includes('Bergen County') || !html.includes('guide-form')) throw new Error('The built page is incomplete.');
await writeFile(resolve(output, '.nojekyll'), '');
console.log('Production site built in dist/.\nPreview with: npm run preview');

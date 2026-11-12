import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { dirname, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const preview = process.argv.includes('--preview');
const root = preview ? resolve(project, 'dist') : project;
if (preview && !existsSync(resolve(root, 'index.html'))) {
  console.error('Build the site first: npm run build');
  process.exit(1);
}
const portArg = process.argv.indexOf('--port');
const port = Number(portArg >= 0 ? process.argv[portArg + 1] : process.env.PORT || (preview ? 4173 : 5173));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.mp4': 'video/mp4' };
const publicFiles = new Set(['index.html', 'styles.css', 'app.js', 'site.config.js']);
const server = createServer((request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      return response.end('Method not allowed');
    }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const file = resolve(root, relative);
    if (!file.startsWith(root + sep) || (!publicFiles.has(relative) && !relative.startsWith('assets/')) || !existsSync(file) || !statSync(file).isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return response.end('Page not found');
    }
    const info = statSync(file);
    const headers = { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Content-Length': info.size, 'Cache-Control': preview ? 'public, max-age=300' : 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' };
    const range = request.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      const rejectRange = () => {
        response.writeHead(416, { 'Content-Range': `bytes */${info.size}`, 'Content-Length': 0 });
        response.end();
      };
      if (!match || (!match[1] && !match[2]) || info.size === 0) return rejectRange();
      const first = match[1] ? Number(match[1]) : null;
      const last = match[2] ? Number(match[2]) : null;
      if ((first !== null && !Number.isSafeInteger(first)) || (last !== null && !Number.isSafeInteger(last))) return rejectRange();
      const start = first === null ? Math.max(0, info.size - last) : first;
      const end = first === null || last === null ? info.size - 1 : Math.min(last, info.size - 1);
      if (start >= info.size || start > end || (first === null && last === 0)) return rejectRange();
      response.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${info.size}`, 'Content-Length': end - start + 1 });
      if (request.method === 'HEAD') return response.end();
      return createReadStream(file, { start, end }).pipe(response);
    }
    response.writeHead(200, headers);
    if (request.method === 'HEAD') return response.end();
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
  }
});
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Choose another with: npm run dev -- --port 5174` : error.message);
  process.exit(1);
});
server.listen(port, '127.0.0.1', () => console.log(`Bergen County Sell & Move\nLocal: http://localhost:${port}\n${preview ? 'Production preview' : 'Local development'} | Press Ctrl+C to stop.`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));

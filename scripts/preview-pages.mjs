import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const port = Number(process.env.PORT || 4173);

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.yaml', 'application/yaml; charset=utf-8'],
  ['.yml', 'application/yaml; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.txt', 'text/plain; charset=utf-8'],
]);

await ensureDistExists();

const server = http.createServer(async (request, response) => {
  try {
    const filePath = await resolveRequestPath(request.url || '/');
    const body = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes.get(extension) || 'application/octet-stream';

    response.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
    });
    response.end(body);
  } catch (error) {
    const statusCode = error?.code === 'ENOENT' ? 404 : 500;
    const fallbackPath = path.join(distDir, statusCode === 404 ? '404.html' : 'index.html');

    try {
      const fallbackBody = await fs.readFile(fallbackPath);
      response.writeHead(statusCode, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      response.end(fallbackBody);
    } catch {
      response.writeHead(statusCode, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      response.end(statusCode === 404 ? 'Not found' : 'Internal server error');
    }
  }
});

server.listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}`);
  console.log('Serving generated files from dist/.');
});

async function ensureDistExists() {
  try {
    const stat = await fs.stat(distDir);
    if (!stat.isDirectory()) {
      throw new Error('dist exists but is not a directory');
    }
  } catch {
    throw new Error('dist/ does not exist yet. Run "npm run build:pages" first or use "npm run preview:pages".');
  }
}

async function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const normalizedPath = path.normalize(path.join(distDir, pathname));

  if (!normalizedPath.startsWith(distDir)) {
    throw Object.assign(new Error('Path traversal attempt rejected'), { code: 'ENOENT' });
  }

  const candidates = [];
  if (pathname.endsWith('/')) {
    candidates.push(path.join(normalizedPath, 'index.html'));
  } else {
    candidates.push(normalizedPath);
    candidates.push(`${normalizedPath}.html`);
    candidates.push(path.join(normalizedPath, 'index.html'));
  }

  for (const candidate of candidates) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  throw Object.assign(new Error(`No file for ${pathname}`), { code: 'ENOENT' });
}
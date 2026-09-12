import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = (...parts) => resolve(root, 'src', ...parts);
const output = (...parts) => resolve(root, ...parts);

const scriptFiles = [
  'state.js',
  'views.js',
  'actions.js',
  'app.js',
];

const [template, styles, ...scripts] = await Promise.all([
  readFile(source('index.template.html'), 'utf8'),
  readFile(source('styles.css'), 'utf8'),
  ...scriptFiles.map((file) => readFile(source('js', file), 'utf8')),
]);

function replaceOnce(text, marker, value) {
  if (text.split(marker).length !== 2) {
    throw new Error(`Expected exactly one ${marker} marker.`);
  }
  return text.replace(marker, value.trimEnd());
}

const indexHtml = replaceOnce(
  replaceOnce(template, '/* BUILD:STYLES */', styles),
  '// BUILD:SCRIPTS',
  scripts.join('\n'),
);
const buildHash = createHash('sha256').update(indexHtml).digest('hex').slice(0, 12);
const serviceWorker = `const CACHE = 'palne-${buildHash}';
const FILES = ['/Fuel-track/', '/Fuel-track/index.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => name.startsWith('palne-') && name !== CACHE)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
`;

await Promise.all([
  writeFile(output('index.html'), indexHtml),
  writeFile(output('sw.js'), serviceWorker),
]);

console.log(`Built Fuel Tracker (${buildHash}).`);


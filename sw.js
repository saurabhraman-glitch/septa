
// Simple service worker: cache app shell
const CACHE = 'septa-pwa-v1';
const SHELL = ['.', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE && caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Never cache the serverless function responses
  if (url.pathname.startsWith('/.netlify/functions/')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

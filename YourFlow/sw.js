// Версия кэша. Увеличиваем, чтобы браузер точно обновил сервис-воркер.
const CACHE_VERSION = 'v1.5-final-fix';
const CACHE_NAME = `potok-app-cache-${CACHE_VERSION}`;

// Полные, абсолютные URL-адреса для гарантированной работы на GitHub Pages
const APP_SHELL_URLS = [
  'https://authortools.github.io/YourFlow/',
  'https://authortools.github.io/YourFlow/index.html',
  'https://authortools.github.io/YourFlow/style.css',
  'https://authortools.github.io/YourFlow/script.js',
  'https://authortools.github.io/YourFlow/manifest.json',
  'https://authortools.github.io/YourFlow/icons/icon-192.png',
  'https://authortools.github.io/YourFlow/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Установка v${CACHE_VERSION}`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Кэширование оболочки приложения по абсолютным путям.');
        return cache.addAll(APP_SHELL_URLS);
      })
      .catch(err => {
        console.error('[Service Worker] КАТАСТРОФА! Ошибка кэширования:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log(`[Service Worker] Активация v${CACHE_VERSION}`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('potok-app-cache-') && cacheName !== CACHE_NAME) {
            console.log(`[Service Worker] Удаление старого кэша: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

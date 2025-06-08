const CACHE_VERSION = 'v1.2'; // Сменил версию, чтобы кэш точно обновился
const CACHE_NAME = `potok-app-cache-${CACHE_VERSION}`;

// Оболочка приложения с правильными путями для GitHub Pages
const APP_SHELL_URLS = [
  '/YourFlow/',
  '/YourFlow/index.html',
  '/YourFlow/style.css',
  '/YourFlow/script.js',
  '/YourFlow/manifest.json',
  '/YourFlow/icons/icon-192.png',
  '/YourFlow/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Установка');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Кэширование оболочки приложения');
        return cache.addAll(APP_SHELL_URLS);
      })
      .catch(err => {
        console.error('[Service Worker] Ошибка кэширования при установке:', err);
        console.error('Не удалось закэшировать один из URL:', APP_SHELL_URLS);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Активация');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
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
  // Отвечаем на запросы из кэша, если они там есть
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Если ресурс есть в кэше - отдаем его
      if (cachedResponse) {
        return cachedResponse;
      }
      // Если ресурса нет в кэше - идем в сеть.
      // Не кэшируем сторонние ресурсы (например, Google Fonts) в этом примере.
      return fetch(event.request);
    })
  );
});

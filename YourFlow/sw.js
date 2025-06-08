// Версия кэша, меняем для принудительного обновления
const CACHE_VERSION = 'v1.3-relative-paths';
const CACHE_NAME = `potok-app-cache-${CACHE_VERSION}`;

// Оболочка приложения с ОТНОСИТЕЛЬНЫМИ путями
const APP_SHELL_URLS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Установка с относительными путями');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Кэширование оболочки приложения');
        return cache.addAll(APP_SHELL_URLS);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Активация');
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
      // Если ресурс есть в кэше - отдаем его
      if (cachedResponse) {
        return cachedResponse;
      }
      // Если ресурса нет в кэше - идем в сеть
      return fetch(event.request);
    })
  );
});

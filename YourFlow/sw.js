// Версия кэша. Меняй ее, когда обновляешь файлы приложения (css, js),
// чтобы сервис-воркер загрузил новые версии.
const CACHE_VERSION = 'v1.1';
const CACHE_NAME = `potok-app-cache-${CACHE_VERSION}`;

// "Оболочка" приложения – все основные файлы, нужные для работы UI.
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 1. Событие 'install' - кэширование оболочки приложения
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Установка');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Кэширование оболочки приложения');
        return cache.addAll(APP_SHELL_URLS);
      })
  );
});

// 2. Событие 'activate' - очистка старого кэша
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Активация');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Если имя кэша не совпадает с текущим, удаляем его
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

// 3. Событие 'fetch' - отдача ресурсов из кэша или сети
self.addEventListener('fetch', (event) => {
  // Мы не кэшируем запросы к Google Fonts, а всегда идем за ними в сеть.
  // Для простоты, в данном случае мы кэшируем только наши локальные ресурсы.
  if (event.request.url.startsWith(self.location.origin)) {
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
  }
});
const CACHE_NAME = 'localpulse-v2.1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/localpulse-192.svg',
  '/icons/localpulse-512.svg',
];

// Установка: кэшируем только критические статические файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Активация: чистим старые версии кэша
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Игнорируем запросы к Supabase и сторонним API
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  // 2. Стратегия для HTML и ресурсов (Network First)
  // Пытаемся взять свежее из сети, если нет связи — отдаем кэш
  event.respondWith(
    fetch(request)
      .then(response => {
        // Если ответ ок, сохраняем/обновляем его в кэше
        if (response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Если сеть упала, ищем в кэше
        return caches.match(request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Если и в кэше нет, отдаем заглушку для офлайна
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline content not available', { status: 503 });
        });
      })
  );
});

// sw.js
const CACHE_NAME = 'utils-pwa-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/abas.js',
    '/js/texto.js',
    '/js/qr-url.js',
    '/js/qr-pix.js',
    '/favicon.ico',
    '/images/blacodegs-165.png',
    '/images/blacodegs-192.png',
    '/images/blacodegs-400-87.png',
    '/images/blacodegs-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                    .catch(err => {
                        console.warn('Falha ao adicionar alguns recursos:', err);
                    });
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .catch(() => {
                        return new Response('Você está offline. Alguns recursos podem não estar disponíveis.');
                    });
            })
    );
});
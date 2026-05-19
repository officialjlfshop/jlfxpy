// JLF Fireworks - Service Worker v3
const CACHE_NAME = 'jlf-cache-v3';
const STATIC_CACHE = 'jlf-static-v3';
const IMAGE_CACHE = 'jlf-images-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/landing.html',
  '/admin.html',
  '/offline.html',
  '/manifest.json',
  '/css/main.css',
  '/js/app.js',
  '/js/config.js',
  '/js/helpers.js',
  '/js/state.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(IMAGE_CACHE)
    ])
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== IMAGE_CACHE && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, cache fallback
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Image caching strategy
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache => {
        return fetch(event.request).then(response => {
          if (response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => {
          return cache.match(event.request);
        });
      })
    );
    return;
  }
  
  // API calls - network only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // HTML pages - network first, then cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
    return;
  }
  
  // Static assets - cache first
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Push notification handler
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'New update from JLF Fireworks!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'View Details' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'JLF Fireworks', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});
async function initCache() {
	const cache = await caches.open('my-site-cache-v1');
	return cache.addAll([
		"/",
		"/manifest.json",
		"/icon-192.png",
		"/icon-512.png"
	]);
}

self.addEventListener('install', event => event.waitUntil(initCache()));

async function interceptFetch(event) {
	const cachedResponse = caches.match(event.request);

	if (cachedResponse) { // Cache hit
		console.log("cache hit", cachedResponse);
		return cachedResponse;
	}

	const response = await fetch(event.request.clone());

	if(!response || response.status !== 200 || response.type !== 'basic') {
		console.log("redirect", response);
		return response;
	}
	const cache = await caches.open(CACHE_NAME);
	cache.put(event.request, response.clone());
	console.log("follow", response);
	return response;
}

self.addEventListener('fetch', event => event.respondWith(interceptFetch(event)));
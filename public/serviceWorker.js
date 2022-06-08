// storage of the browser //version-1 is the name of cache
const CACHE_NAME = "version-1";

//offline.html represent the page when app has no internet connection
const urlsToCache = ["index.html", "offline.html"];

//self means serviceWorker itself
const self = this;

// Install SW(ServiceWorker)
self.addEventListener("install", (event) => {
	event.waitUntil(
		//waiting until cache is opened
		caches.open(CACHE_NAME).then((cache) => {
			console.log("Opened cache");

			return cache.addAll(urlsToCache); //Add all URLs to cache specified above
		})
	);
});

// Listen for requests
self.addEventListener("fetch", (event) => {
	event.respondWith(
		//respond with something when something is fetched
		caches.match(event.request).then(() => {
			return fetch(event.request).catch(
				() =>
					//if this fetch returns a catch then error is thrown
					caches.match("offline.html") //when catch is thrown then return offline.html
			);
		})
	);
});

// Activate the SW(ServiceWorker)
self.addEventListener("activate", (event) => {
	const cacheWhitelist = [];
	cacheWhitelist.push(CACHE_NAME); //whitelist is pushed with cache name

	event.waitUntil(
		//wait until we get caches.keys()
		caches.keys().then((cacheNames) =>
			Promise.all(
				cacheNames.map((cacheName) => {
					if (!cacheWhitelist.includes(cacheName)) {
						//if whitelist does not include cacheName then delete that specific cache
						return caches.delete(cacheName); //it only keeps version-1 and deletes all the previous versions
					}
				})
			)
		)
	);
});

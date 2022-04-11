const StaticCacheName = "site-static-v1";
const cacheAssets = [
    "/",
    "/index.html"
];

addEventListener("install", evt => {
    evt.waitUntil(
        caches
            .open(StaticCacheName)
            .then(cache => {
                console.log("SW OK Installed");
                return cache.match(evt.request).then(cacheResponse =>
                    cacheResponse || fetch(evt.request).then(networkResponse => {
                        cache.put(evt.request, networkResponse.clone());
                        cache.addAll(cacheAssets);
                        return networkResponse;
                    }
                    )
                )
            })
            .catch(err => {
                console.log(err)})
    );
});


addEventListener("fetch", evt => {
    evt.respondWith(
        caches
            .match(evt.request)
            .then(res => {
                return res || fetch(evt.request);
            })
            .catch(err => {
                if (evt.request.url.indexOf(".html") > -1) {
                    return caches.match(evt.request);
                }
            })
    );
});


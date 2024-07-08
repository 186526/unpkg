export default {
    async fetch(request, env) {
        let url = new URL(request.url);

        let isCached = false;

        if (url.pathname.startsWith('/npm')) isCached = true;
        else if (url.pathname.startsWith('/avatar')) isCached = true;
        else if (url.pathname.startsWith('/api')) isCached = false;
        else isCached = false;

        if (url.pathname.startsWith('/')) {
            // eslint-disable-next-line no-undef
            url.hostname = context.env.hostname;
            url.protocol = 'http';
            let new_request = new Request(url, request);
            return fetch(new_request, {
                cf: {
                    cacheEverything: isCached
                }
            }).then(k => {
                const a = new Response(k.body, k);
                return a;
            });
        }

        return new Response('Not Found', { status: 404 });
    }
};

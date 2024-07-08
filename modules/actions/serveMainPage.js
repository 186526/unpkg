export default function serveMainPage(req, res) {
    const html = `200 OK\n\nCompatible with unpkg.com`;

    res.set({
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=14400', // 4 hours
        'Cache-Tag': 'main'
    }).send(html);
}

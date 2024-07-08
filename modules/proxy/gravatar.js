import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
    target: process.env.GRAVATAR_URL ?? 'https://secure.gravatar.com/avatar',
    changeOrigin: true
});

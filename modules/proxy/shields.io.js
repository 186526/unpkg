import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
    target: process.env.GRAVATAR_URL ?? 'https://img.shields.io/badge',
    changeOrigin: true
});

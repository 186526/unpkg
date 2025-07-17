import { createProxyMiddleware } from 'http-proxy-middleware';

export default path =>
    createProxyMiddleware({
        target: process.env.GRAVATAR_URL ?? `https://img.shields.io${path}`,
        changeOrigin: true
    });

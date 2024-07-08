export default function isBrowser() {
    return (req, res, next) => {
        if (req.headers['user-agent'].includes('Mozilla')) {
            return next();
        }
        next('route');
    };
}

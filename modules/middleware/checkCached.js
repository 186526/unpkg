import { packageCache } from '../utils/npm';

export default function checkCached(req, res, next) {
    req.isCached = packageCache.has(`${req.packageName}@${req.packageVersion}`);

    if (req.isCached) {
        res.set('X-UNPKG-Cache', 'HIT');
    } else {
        res.set('X-UNPKG-Cache', 'MISS');
    }
    
    next();
}

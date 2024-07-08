import createServer from './createServer';
import express from 'express';
import apicache from 'apicache';

import gravatar from './proxy/gravatar';
import api from './proxy/api';

apicache.options({
    statusCodes: { include: [200] },
    trackPerformance: true,
    appendKey: (req, rep) => {
        if (req.originalUrl.startsWith('/avatar')) {
            req.apicacheGroup = 'gravatar';
            return req.originalUrl.replaceAll('/avatar/', '');
        }

        if (req.originalUrl.startsWith('/npm')) {
            req.apicacheGroup = 'unpkg';
            return req.originalUrl.replaceAll('/npm/', '');
        }

        req.apicacheGroup = 'default';
        return req.method + req.originalUrl;
    },
    respectCacheControl: true
});

const cache = apicache.middleware('6 hours');

const unpkgServer = createServer();

const App = express();

App.disable('x-powered-by');
App.enable('trust proxy');
App.enable('strict routing');

App.use('/npm', (req, resp, next) => {
    unpkgServer(req, resp);
});

App.use('/avatar', cache, gravatar);

App.use('/api', api(apicache));

const port = process.env.PORT || 8080;

App.listen(port, () => {
    console.log('Server listening on port %s, Ctrl+C to quit', port);
});

export default App;

import { Router } from 'express';

const App = Router();

export default apicache => {
    App.get('/cache/index', (req, rep, next) => {
        rep.send(apicache.getIndex());
    });

    App.get('/cache/clear/:key?', (req, rep, next) =>  {
        rep.send(200, apicache.clear(req.params.key || req.query.key));
    });

    App.get('/cache/performance', (req, rep) => {
        rep.send(200, apicache.getPerformance())
    });

    return App;
};

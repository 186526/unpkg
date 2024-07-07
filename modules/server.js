import createServer from './createServer';
import express from 'express';

const unpkgServer = createServer();

const App = express();

App.disable('x-powered-by');
App.enable('trust proxy');
App.enable('strict routing');

App.use('/npm', (req, resp, next) => {
  unpkgServer(req, resp);
});

const port = process.env.PORT || 8080;

App.listen(port, () => {
  console.log('Server listening on port %s, Ctrl+C to quit', port);
});

export default App;

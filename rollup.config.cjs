const builtinModules = require('module').builtinModules;
const execSync = require('child_process').execSync;

const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const replace = require('@rollup/plugin-replace');
const resolve = require('@rollup/plugin-node-resolve');
const url = require('@rollup/plugin-url');

const entryManifest = require('./plugins/entryManifest.cjs');

const buildId =
  process.env.BUILD_ID ||
  execSync('git rev-parse --short HEAD').toString().trim();

const manifest = entryManifest();

const packageJson = require('./package.json');

const server = {
  external: builtinModules.concat(Object.keys(packageJson.dependencies)),
  input: 'modules/server.js',
  output: { file: 'server.js', format: 'es' },
  moduleContext: {
    'node_modules/react-icons/lib/esm/iconBase.js': 'global'
  },
  plugins: [
    manifest.inject({ virtualId: 'entry-manifest' }),
    resolve(),
    commonjs(),
    url({
      limit: 5 * 1024,
      publicPath: '/_client/',
      emitFiles: false
    }),
    replace({
      'process.env.BUILD_ID': JSON.stringify(buildId)
    }),
    json()
  ]
};

module.exports = server;

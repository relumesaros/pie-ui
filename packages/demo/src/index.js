const express = require('express');

const minimist = require('minimist');
const { basename, resolve } = require('path');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const {
  getPkgAndDemo,
  createEntryObject,
  generateMarkupFromData,
  getGitInfo,
  writeIndex,
  getPackages
} = require('./shared');
const hotMiddleware = require('webpack-hot-middleware');
const publicPath = '/assets';
const debug = require('debug');
const { DEFAULT_PORT } = require('./defaults');

const log = debug('pie-ui:demo:server');
const BUILD_DIR = '.out-runtime';

const OUT_DIR = resolve(__dirname, '..', BUILD_DIR);

const args = minimist(process.argv.slice(2));

const PORT = args.port || DEFAULT_PORT;

/**
 * 1. scope
 * 2. reload
 */

const buildApp = (config, pkgAndDemos, gitInfo) => {
  const app = express();

  const compiler = webpack(config);

  app.use(
    middleware(compiler, {
      // webpack-dev-middleware options
      publicPath
    })
  );

  app.use(hotMiddleware(compiler));

  app.set('view engine', 'pug');

  app.set('views', resolve(__dirname, '..', 'views'));

  app.get('/', (req, res) => {
    res.render('index', {
      gitInfo,
      packages: pkgAndDemos.map(p => ({ ...p, shortName: basename(p.name) }))
    });
  });

  app.get('/:name.html', (req, res) => {
    const name = req.params.name;

    log('name:', name);

    try {
      const { demo, ...pkg } = pkgAndDemos.find(k => basename(k.name) === name);

      const markup = demo.markup
        ? demo.markup
        : generateMarkupFromData(demo.data, `${name}-el`);

      res.render('package-demo', {
        gitInfo,
        name,
        data: demo.data,
        session: demo.session,
        markup: markup,
        pkg,
        tagName: demo.tagName,
        changelog: pkg.changelog,
        nextChangelog: pkg.nextChangelog
      });
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });
  return app;
};

const buildWebpackConfig = () => {
  const gitInfo = getGitInfo();
  log('-> gitInfo', gitInfo);

  const packages = getPackages(args.scope ? [args.scope] : undefined);

  log('packages:', packages.map(p => p.name));

  const pkgAndDemos = getPkgAndDemo(
    gitInfo.branch !== 'master' && 'next',
    packages
  );

  const entry = createEntryObject(OUT_DIR, pkgAndDemos, args.hotReload);

  entry.index = './index.js';

  if (args.hotReload) {
    Object.keys(entry).forEach(k => {
      entry[k] = [entry[k], 'webpack-hot-middleware/client'];
    });
  }

  log('entry:', entry);
  writeIndex(OUT_DIR);

  const plugins = args.hotReload
    ? [new webpack.HotModuleReplacementPlugin()]
    : [];

  const base = require('../webpack.config');
  const config = {
    ...base,
    mode: 'development',
    entry,
    context: resolve(OUT_DIR),
    output: {
      publicPath
    },
    plugins
  };

  return Promise.resolve({ config, pkgAndDemos, gitInfo });
};

const run = async () => {
  log('args', args);
  const { config, pkgAndDemos, gitInfo } = await buildWebpackConfig();
  const app = buildApp(config, pkgAndDemos, gitInfo);
  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
};

run().catch(e => {
  console.error(e);
});

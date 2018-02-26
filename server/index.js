const Koa = require('koa');
const koaMount = require('koa-mount');
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const home = require('./home');
const { URL_PREFIX } = require('./constants');
const push = require('./push');

/**
 * Static Files
 */
const ghPage = new Koa();
// static
ghPage.use(koaStatic('.', {
  index: 'we_do_NOT_need_default_file_name_lile_index.html',
}));
// home page
ghPage.use(home);

/**
 * Server
 */
const app = new Koa();
// make it like gh-pages
app.use(koaMount(URL_PREFIX, ghPage));
// web push server
app.use(bodyParser());
app.use(push);

// start server
const PORT = 8080;
app.listen(PORT);
console.log(`Server started http://localhost:${PORT}${URL_PREFIX}`);

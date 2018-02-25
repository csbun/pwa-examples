const Koa = require('koa');
const koaMount = require('koa-mount');
const koaStatic = require('koa-static');
const home = require('./server/home');

const app = new Koa();
// static
app.use(koaStatic('.', {
  index: 'we_do_NOT_need_default_file_name_lile_index.html',
}));
// home page
app.use(home);

// make it like gh-pages
const ghPageServer = new Koa();
ghPageServer.use(koaMount(require('./server/constants').URL_PREFIX, app));

// start server
const PORT = 8080;
ghPageServer.listen(PORT);
console.log(`Server started http://localhost:${PORT}`);
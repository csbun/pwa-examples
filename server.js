const Koa = require('koa');
const koaStatic = require('koa-static');
const home = require('./server/home');


const app = new Koa();
const PORT = 8080;

// static
app.use(koaStatic('.', {
  index: 'we_do_NOT_need_default_file_name_lile_index.html',
}));

// home page
app.use(home);

// start server
app.listen(PORT);
console.log(`Server started http://localhost:${PORT}`);

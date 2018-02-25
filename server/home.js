const fs = require('fs');
const path = require('path');
const { URL_PREFIX } = require('./constants');

const ROOT = path.join(__dirname, '../');
const CURRENT_PATH = path.basename(__dirname);

function isExamplePath(p) {
  if (p.indexOf('.') === 0) {
    return false;
  }
  if (p === CURRENT_PATH || p === 'node_modules') {
    return false;
  }
  const dirStat = fs.statSync(path.join(ROOT, p));
  return dirStat.isDirectory();
}

module.exports = async function home(ctx, next) {
  if (ctx.path === '/') {
    const HTML = fs.readdirSync(ROOT)
      .filter(isExamplePath)
      .map(x => `<p><a href="${URL_PREFIX}/${x}/index.html">${x}</a></p>`)
      .join('');
    ctx.body = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>PWA Examples</title>
      </head>
      <body>${HTML}</body>
      </html>`;
  } else {
    next();
  }
};

// https://github.com/web-push-libs/web-push
const webpush = require('web-push');
const inMemoryDB = {};

/**
 * Saving Subscriptions
 */
function handleSubscription(ctx) {
  const { body } = ctx.request;
  if (body.endpoint) {
    inMemoryDB[body.endpoint] = body;
    console.log('[subscribed]', body.endpoint);
    ctx.body = {
      success: true,
    };
  } else {
    ctx.body = {
      success: false,
      msg: '`endpoint` is required!'
    };
  }
}

/**
 * Sending Push Messages
 */
const vapidKeys = {
  publicKey:
'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
  privateKey: 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls'
};
webpush.setVapidDetails(
  'mailto:icsbun@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
async function handlePushAsync(ctx) {
  const { msg } = ctx.request.body
  let successCount = 0;
  let failCount = 0;
  const promises = Object.keys(inMemoryDB).map(function(key) {
    return webpush.sendNotification(inMemoryDB[key], msg)
      .then(function() {
        successCount += 1;
      })
      .catch((err) => {
        failCount += 1;
        if (err.statusCode === 410) {
          delete inMemoryDB[key];
        } else {
          console.log('Subscription is no longer valid: ', err);
        }
      });
  });
  await Promise.all(promises)
    .then(function() {
      ctx.body = {
        success: true,
        successCount,
        failCount,
      };
    })
    .catch(function(e) {
      ctx.body = {
        success: false,
        msg: e.message,
      };
    });
}

module.exports = async function home(ctx, next) {
  if (ctx.path === '/api/save-subscription/' && ctx.method === 'POST') {
    handleSubscription(ctx);
  } else if (ctx.path === '/api/trigger-push-msg/' && ctx.method === 'POST') {
    await handlePushAsync(ctx);
  } else {
    next();
  }
};



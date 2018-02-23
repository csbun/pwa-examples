function sendMessage(message, twoWay) {
  // This wraps the message posting/response in a promise, which will resolve if the response doesn't
  // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
  // a convenient wrapper.
  return new Promise(function(resolve, reject) {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function(event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply via postMessage(), which
    // will in turn trigger the onmessage handler on messageChannel.port1.
    // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller.postMessage(
      { twoWay, message },
      [messageChannel.port2]
    );
  });
}

function bindClickEventToDispatchSWEvent(id, twoWay) {
  var elBtn = document.getElementById('btn' + id);
  var elInput = document.getElementById('input' + id);
  var elMsg = document.getElementById('msg' + id);
  if (elBtn) {
    elBtn.addEventListener('click', function() {
      sendMessage(elInput ? elInput.value : '', twoWay).then(function (data) {
        if (elMsg) {
          elMsg.innerHTML = JSON.stringify(data);
        }
      });
    })
  }
}

// Register A service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/01.service-workers/sw.js')
      .then(function(registration) {
        // Registration was successful
        console.log('[success] scope: ', registration.scope);
        bindClickEventToDispatchSWEvent('1', false);
        bindClickEventToDispatchSWEvent('2', true);
      }, function(err) {
        // registration failed :(
        console.log('[fail]: ', err);
      });
  });
}

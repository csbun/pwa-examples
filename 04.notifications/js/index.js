const elTitle = document.getElementById('title');
const elBody = document.getElementById('body');
const elBtn1 = document.getElementById('btn1');
const elBtn2 = document.getElementById('btn2');
const prefix = location.pathname.replace(/\/(index\.html)?$/, '');

function bindBtnClickWhilePermissionGranted(btn, cb) {
  btn.addEventListener('click', function(e) {
    if (Notification.permission === 'granted') {
      cb(e);
    } else {
      alert('Permission' + Notification.permission);
    }
  });
}

// get permission
Notification.requestPermission()
  .then(function(permission) {
    if (permission === 'denied') {
      console.log('[Permission] wasn\'t granted. Allow a retry.');
      return;
    }
    if (permission === 'default') {
      console.log('[Permission] request was dismissed.');
      return;
    }
    console.log('[Permission]', permission);
  });

// simple notification: use new Notification
bindBtnClickWhilePermissionGranted(elBtn1, function() {
  var n = new Notification(elTitle.value, {
    body: elBody.value,
    icon: `${prefix}/images/icon-96.png`,
    vibrate: [ 200, 100, 200, 100, 200 ],
  });
});

// notification with actions: use serviceWorker
navigator.serviceWorker
  .register(`${prefix}/sw.js`)
  .then(function(registration) {
    // Registration was successful
    console.log('[success] scope: ', registration.scope);
    // bind actions
    bindBtnClickWhilePermissionGranted(elBtn2, function() {
      registration.showNotification(elTitle.value, {
        body: elBody.value,
        tag: 'message',
        renotify: true,
        icon: `${prefix}/images/icon-96.png`,
        badge: `${prefix}/images/badge-72.png`, // Mobile Only
        vibrate: [ 200, 100, 200, 100, 200 ], // Mobile Only
        // Adding data to a notification
        data: {
          time: Date.now(),
        },
        // actions
        actions: [{
          action: 'y',
          title: 'Yes',
          icon: `${prefix}/images/check.png`,
        }, {
          action: 'n',
          title: 'No',
          icon: `${prefix}/images/cross.png`,
        }]
      });
    });
  }, function(err) {
    // registration failed :(
    console.log('[fail]: ', err);
  });



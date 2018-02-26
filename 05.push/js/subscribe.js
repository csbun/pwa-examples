const prefix = location.pathname.replace(/\/(index\.html)?$/, '');
const subscribeOptions = {
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(
    'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
  ),
};

navigator.serviceWorker
  .register(`${prefix}/sw.js`)
  .then(function(registration) {
    // If your web app doesn't have permissions for showing notifications at the time of calling subscribe(), the browser will request the permissions for you.
    // If you want more control, stick to the Notification.requestPermission() API.
    return registration.pushManager.subscribe(subscribeOptions);
  })
  .then(function(pushSubscription) {
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    return sendSubscriptionToBackEnd(pushSubscription);
  });

// Send a Subscription to Your Server
function sendSubscriptionToBackEnd(subscription) {
  return fetch('/api/save-subscription/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription),
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Bad status code from server.');
    }

    return response.json();
  })
  .then(function(responseData) {
    if (!responseData.success) {
      throw new Error('Response error:' + responseData.msg);
    }
    // Everything goes right!
    console.log('User Subscribed!');
  });
}

// https://github.com/GoogleChromeLabs/web-push-codelab/blob/master/app/scripts/main.js
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
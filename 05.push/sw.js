// https://developers.google.com/web/fundamentals/push-notifications/handling-messages
self.addEventListener('push', function(event) {
  if (event.data) {
    const text = event.data.text();
    console.log('This push event has data: ', text);
    event.waitUntil(self.registration.showNotification(text));
  } else {
    console.log('This push event has no data.');
  }
});

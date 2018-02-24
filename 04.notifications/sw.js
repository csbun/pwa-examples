// https://developers.google.com/web/fundamentals/push-notifications/notification-behaviour
self.addEventListener('notificationclick', function(event) {
  console.log('With data', event.notification.data);

  if (!event.action) {
    // Was a normal notification click
    console.log('A Normal Notification Click.');
    return;
  }

  switch (event.action) {
    case 'y':
      console.log('User click "Yes"!');
      break;
    case 'n':
      console.log('Sorry to say "No"');
      break;
    default:
      console.log('Unknown action: ', event.action);
  }
});

// https://developers.google.com/web/fundamentals/push-notifications/common-notification-patterns
self.addEventListener('notificationclose', function(event) {
  console.log('Notification Closed');
  console.log('With data', event.notification.data);
});

/**
 * TODO
 * on Chrome/64.0.3282 
 * If the first click is 'close', 'notificationclose' event fired
 * If the first click is 'notificationclick', next 'close click' will also fire event 'notificationclick'
 * And no 'notificationclose' is fired while next notification comes out
 * 
 * Works Fine on FireFox
 * 
 * But no 'notificationclose' is fired while notification auto disappeare both on Chrome and FF
 */

self.addEventListener('install', function() {
  console.log('Installed');
});

self.addEventListener('activate', function() {
  console.log('Activated');
});

self.addEventListener('message', function(e) {
  console.log('Get message with data:', e.data);
  console.log(e.ports);
  if (e.data && e.data.twoWay) {
    e.ports[0].postMessage({
      message: e.data.message,
      time: new Date(),
    });
  }
});

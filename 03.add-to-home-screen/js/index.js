// Register A service worker, for offline cache
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/03.add-to-home-screen/sw.js')
      .then(function(registration) {
        // Registration was successful
        console.log('[success] scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('[fail]: ', err);
      });
  });
}

// Did a user install the app?
// https://developers.google.com/web/fundamentals/app-install-banners/
window.addEventListener('beforeinstallprompt', function(e) {
  console.log('beforeinstallprompt');
  e.userChoice.then(function(choiceResult) {
    if (choiceResult.outcome == 'accepted') {
      console.log('[', choiceResult.outcome, '] User added to home screen');
    } else { // TODO: `dismissed` never comes out
      console.log('[', choiceResult.outcome, '] User cancelled home screen install');
    }
  }).catch(function(e) {
    console.log(e);
  });
});

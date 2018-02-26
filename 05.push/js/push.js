const elInput = document.getElementById('input');
const elBtn = document.getElementById('btn');

elBtn.addEventListener('click', function() {
  fetch('/api/trigger-push-msg/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ msg: elInput.value }),
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
    console.log(
      'Pushed! success:',
      responseData.successCount,
      'fail:',
      responseData.failCount,
    );
  });
});

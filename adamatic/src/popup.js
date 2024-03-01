const $USERNAME = document.getElementById('username');
const $PASSWORD = document.getElementById('password');
const $VISIBILITY = document.getElementById('visibility');
const $SAVE = document.getElementById('save');

chrome.storage.sync.get(null).then((storage) => {
	if (storage.username)
		$USERNAME.value = storage.username;
	if (storage.password)
		$PASSWORD.value = storage.password;
});

/*
Click event handlers.
*/

$VISIBILITY.onclick = function() {
	if ($VISIBILITY.innerHTML == 'Show') {
		$PASSWORD.setAttribute('type', 'text');
		$VISIBILITY.innerHTML = 'Hide';
	} else {
		$PASSWORD.setAttribute('type', 'password');
		$VISIBILITY.innerHTML = 'Show';
	}
}

$SAVE.onclick = function() {
	chrome.storage.sync.set({
		'username': $USERNAME.value,
		'password': $PASSWORD.value
	});
	window.close();
}

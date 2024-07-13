const $USERNAME = document.getElementById('username');
const $PASSWORD = document.getElementById('password');
const $SHOW = document.getElementById('show');
const $HIDE = document.getElementById('hide');
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

$SHOW.onclick = () => {
	$PASSWORD.setAttribute('type', 'text');
	$SHOW.style.display = 'none';
	$HIDE.style.display = 'block';
}

$HIDE.onclick = () => {
	$PASSWORD.setAttribute('type', 'password');
	$HIDE.style.display = 'none';
	$SHOW.style.display = 'block';
}

$SAVE.onclick = () => {
	chrome.storage.sync.set({
		'username': $USERNAME.value,
		'password': $PASSWORD.value
	});
	window.close();
}

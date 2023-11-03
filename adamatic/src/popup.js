let DOM_username = document.getElementById('username');
let DOM_password = document.getElementById('password');
let DOM_visibility = document.getElementById('visibility');
let DOM_save = document.getElementById('save');

chrome.storage.sync.get(null).then((result) => {
	if (result.username)
		DOM_username.value = result.username;
	if (result.password)
		DOM_password.value = result.password;
});

/*
Click event handlers.
*/

DOM_visibility.onclick = function() {
	if (DOM_visibility.innerHTML == 'Show') {
		DOM_password.setAttribute('type', 'text');
		DOM_visibility.innerHTML = 'Hide';
	} else {
		DOM_password.setAttribute('type', 'password');
		DOM_visibility.innerHTML = 'Show';
	}
}

DOM_save.onclick = function() {
	chrome.storage.sync.set({
		'username': DOM_username.value,
		'password': DOM_password.value
	});
	window.close();
}

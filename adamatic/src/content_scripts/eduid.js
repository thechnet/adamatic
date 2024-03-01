const PREFIX = 'ADAMatic (eduid): ';

function clickLogin() {
	const $LOGIN = document.getElementById('login-button');
	if (!$LOGIN)
		alert(PREFIX + 'Cannot find login button.');
	else
		$LOGIN.click();
}

const $PASSWORD = document.getElementById('password');
if ($PASSWORD) {
	chrome.storage.sync.get(['password']).then((storage) => {
		if (storage.password) {
			$PASSWORD.value = storage.password;
			clickLogin();
		} else {
			alert(PREFIX + 'No stored password.');
		}
	});
} else {
	const $USERNAME = document.getElementById('username');
	if (!$USERNAME) {
		console.log(PREFIX + 'Cannot find username field.'); /* There are multiple redirects with similar URLs here before we finally arrive at the login form. */
	} else {
		chrome.storage.sync.get(['username']).then((storage) => {
			if (storage.username) {
				$USERNAME.value = storage.username;
				clickLogin();
			} else {
				alert(PREFIX + 'No stored email.');
			}
		});
	}
}

const PREFIX = 'ADAMatic (eduid): ';
const MISSING_CREDENTIALS_MESSAGE = 'Please provide your edu-ID credentials via the extension popup, then reload this page.';

function clickLogin() {
	const $LOGIN = document.getElementById('login-button');
	if (!$LOGIN)
		alert(PREFIX + 'Cannot find the login button. Try reloading the page; if the issue persists, please contact the developer.');
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
			alert(PREFIX + MISSING_CREDENTIALS_MESSAGE);
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
				alert(PREFIX + MISSING_CREDENTIALS_MESSAGE);
			}
		});
	}
}

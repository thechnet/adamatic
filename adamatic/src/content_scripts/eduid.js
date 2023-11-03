let prefix = 'ADAMatic (eduid): ';

function click_login() {
	let DOM_login = document.getElementById('login-button');
	if (!DOM_login) {
		alert(prefix + 'Cannot find login button.');
	} else {
		DOM_login.click();
	}
}

let DOM_password = document.getElementById('password');
if (DOM_password) {
	chrome.storage.sync.get(['password']).then((result) => {
		if (result.password) {
			DOM_password.value = result.password;
			click_login();
		} else {
			alert(prefix + 'No stored password.');
		}
	});
} else {
	let DOM_username = document.getElementById('username');
	if (!DOM_username) {
		console.log(prefix + 'Cannot find username field.'); /* There are multiple redirects with similar URLs here before we finally arrive at the login form. */
	} else {
		chrome.storage.sync.get(['username']).then((result) => {
			if (result.username) {
				DOM_username.value = result.username;
				click_login();
			} else {
				alert(prefix + 'No stored email.');
			}
		});
	}
}

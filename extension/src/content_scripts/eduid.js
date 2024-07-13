const PREFIX = 'ADAMatic (eduid): ';

function injectAlert(kind, text) {
	let $container = document.getElementById('content-container');
	let $title;
	for (let i = 0; i < $container.children.length; ++i) {
		if ($container.children[i].children?.[0].tagName === 'H3') {
			$title = $container.children[i];
			break;
		}
	}
	if ($title)
		$title.insertAdjacentHTML('beforebegin',
			`<div role="alert" class="alert alert-${kind} d-flex align-items-center">
				<img src="${chrome.runtime.getURL('img/icon128.png')}" style="height: 3em; margin-right: 1em;">
				<div>
					<b>ADAMatic</b><br>
					${text}
				</div>
			</div>`
		);
	else
		console.warn(PREFIX + 'Cannot find title, not injecting alert.');
}

function injectHint() {
	injectAlert('light', 'To enable auto-login, enter your edu-ID credentials in the extension popup window, then reload this page.');
}

function clickElementById(id) {
	let $element = document.getElementById(id);
	if (!$element)
		alert(PREFIX + `Cannot find #${id}. Try reloading the page; if the issue persists, please contact the developer.`);
	else
		$element.click();
}

chrome.storage.sync.get(['username', 'password']).then((storage) => {
	
	/* Abort if a problem is detected. */
	if (document.querySelectorAll('.text-danger,.is-invalid').length > 0) {
		console.info(PREFIX + 'Problem detected, aborting.')
		if (storage.password) {
			injectAlert('warning', 'Please ensure the edu-ID credentials you entered in the extension popup window are correct.');
		} else {
			injectHint();
		}
		return;
	}

	/* Try to inject the password, then continue. */
	const $PASSWORD = document.getElementById('password');
	if ($PASSWORD) {
		if (storage.password) {
			$PASSWORD.value = storage.password;
			clickElementById('button-proceed');
		} else {
			injectHint();
		}
		return;
	}
	
	/* Try to inject the username, then continue. */
	const $USERNAME = document.getElementById('username');
	if ($USERNAME) {
		if (storage.username) {
			$USERNAME.value = storage.username;
			clickElementById('button-submit');
		} else {
			injectHint();
		}
		return;
	}

	/* Since there are multiple redirects with similar URLs before we arrive at the login form, this is expected. */
	console.trace(PREFIX + 'Cannot find #username.');
});

const PREFIX = 'ADAMatic (ilias): ';

chrome.storage.sync.get(['rememberView', 'view']).then((storage) => {
	/* Ensure we're on the "Dashboard" page. */
	const $VIEWS = document.getElementsByClassName('il-viewcontrol-mode')[0];
	if (!$VIEWS) {
		console.log(PREFIX + 'Not on "Dashboard" page, stopping.');
		return;
	}

	/* Redirect to the desired view. */
	let currentView = new URLSearchParams(window.location.search).get('show') || undefined;
	if (currentView === undefined && storage.rememberView) {
		for (let i=0; i<$VIEWS.children.length; i++) {
			let dataAction = $VIEWS.children[i].getAttribute('data-action');
			if (
				new URLSearchParams(dataAction).get('show') === storage.view &&
				!$VIEWS.children[i].classList.contains('engaged') /* Don't redirect if the desired view is already engaged. */
			)
				window.location.replace(dataAction);
		}
	}

	/* Remember the current view. */
	chrome.storage.sync.set({ 'view': currentView });

	/* Inject the checkbox. */
	$VIEWS.insertAdjacentHTML('afterend',
		`<style>
			label.adamaticRemember {
				display: inline-block;
				font-size: smaller;
				transform: translateY(1px);
			}
			label.adamaticRemember input[type=checkbox] {
				margin-left: 3px;
				transform: translateY(2px);
			}
		</style>
		<label class="adamaticRemember" title="Remember this preference across sessions">
			<input id="adamaticRemember" type="checkbox"> Remember
		</label>`
	);
	const $REMEMBER = document.getElementById('adamaticRemember');
	$REMEMBER.checked = storage.rememberView;
	$REMEMBER.onchange = function() { chrome.storage.sync.set({ 'rememberView': $REMEMBER.checked }); }
});

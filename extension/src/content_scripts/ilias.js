"use strict";

class Dashboard {
	static #defaultNames = {};

	constructor() {
		if (!this.atCourseList()) {
			console.info('ADAMatic: Not at course list, aborting')
			return;
		}

		this.redirectOrRememberView();

		this.injectStylesheet();
		this.injectRememberCheckbox();
		this.modifyLabels();
	}

	get urlParameters() {
		if (!this._urlParameters)
			this._urlParameters = new URLSearchParams(window.location.search);
		return this._urlParameters;
	}

	atCourseList() {
		return (
			this.urlParameters.get('baseClass').toLowerCase() === 'ildashboardgui' &&
			(!this.urlParameters.has('cmdClass') || this.urlParameters.get('cmdClass').toLowerCase() === 'ildashboardgui')
		);
	}

	redirectOrRememberView() {
		let requestedView = this.urlParameters.get('show');

		/* Abort if a view was requested. */
		if (requestedView) {
			console.info(`ADAMatic: Remembering "${requestedView}"`)
			chrome.storage.sync.set({ 'view': requestedView });
			return;
		}

		/* Redirect if desired and required. */
		if (STORAGE.rememberView) {
			let views = this.$viewsContainer.children;

			for (let i=0; i<views.length; ++i) {
				let dataAction = views[i].getAttribute('data-action');
				if (new URLSearchParams(dataAction).get('show') === STORAGE.view) {
					if (views[i].classList.contains('engaged')) {
						console.info(`ADAMatic: Requested view is already engaged, not redirecting`);
					} else {
						console.info(`ADAMatic: Redirecting to "${STORAGE.view}"`);
						window.location.replace(new URL(dataAction, window.location.origin).toString());
					}
				}
			}
		}
	}

	injectStylesheet() {
		let style = document.createElement('style');
		style.textContent = STYLESHEET;
		document.head.appendChild(style);
	}

	injectRememberCheckbox() {
		this.$viewsContainer.insertAdjacentHTML('beforeend', CHECKBOX);

		let $rememberCheckbox = document.getElementById('adamaticRemember');
		$rememberCheckbox.checked = STORAGE.rememberView;
		$rememberCheckbox.onchange = function() { chrome.storage.sync.set({ 'rememberView': $rememberCheckbox.checked }); }
	}

	modifyLabels() {
		/* Collect courses. */
		
		let $courses = document.createElement('div');
		$courses.setAttribute('id', 'adamaticCourses');
		
		let $panel = document
			.getElementsByClassName('panel-primary')[0]
			.children[1];
		let items = Array.from($panel.children);
		for (let i=2; i<items.length; ++i) {
			$courses.appendChild(items[i]);
		}
		
		$panel.appendChild($courses);
		
		/* Modify labels. */
		
		for (let i=0; i<$courses.children.length; ++i) {
			let $mediaBody = $courses
				.children[i] /* il-item */
				.children[0] /* media */
				.children[1];
			let $anchor = $mediaBody
				.children[0] /* il-item-title */
				.children[0];

			let components = $anchor.innerHTML.split(' – ');
			if (components.length != 2) {
				console.info(`ADAMatic: Skipping item with unrecognized format "${$anchor.innerHTML}"`)
				continue;
			}
			let [courseNumber, courseName] = components;

			Dashboard.#defaultNames[courseNumber] = courseName;

			let style = this.getStyle(courseNumber);

			$anchor.innerHTML = '';
			$anchor.insertAdjacentHTML('afterbegin',
				`<span>${courseNumber}</span><span class="adamaticLabel" id="adamaticLabel${courseNumber}" data-adamaticSort=""></span>`
			);

			/* 'Customize' button. */

			let $mediaBodyContent = $mediaBody
				.children[1] /* il-item-actions */
			let $dropdown = $mediaBodyContent
				.children[0] /* l-bar_element */
				.children[0] /* dropdown */
				.children[1] /* dropdown-menu ul */ ;
			$dropdown.insertAdjacentHTML('afterbegin', dropdownButton(courseNumber));
			let $customize = document.getElementById(`adamaticCustomize${courseNumber}`);
			$customize.onclick = function() {
				let $panel = document.getElementById(`adamaticCustomizationPanel${courseNumber}`);
				if ($panel.style.display === 'block') {
					Dashboard.getCloseCustomizationPanel(courseNumber).click();
					return;
				}
				let panels = document.getElementsByClassName('adamaticCustomizationPanel');
				for (let i = 0; i < panels.length; ++i) {
					panels[i].style.display = 'none';
				}
				$panel.style.display = 'block';
			}

			/* Panel */

			$mediaBodyContent.insertAdjacentHTML('afterend', customizationPanel(courseNumber));
			Dashboard.getCloseCustomizationPanel(courseNumber).onclick = () => {
				Dashboard.getCustomizationPanel(courseNumber).style.display = 'none';
				this.sortLabels();
			}
			let swatches = Dashboard.getSwatches(courseNumber);
			for (let i=0; i<LABEL_STYLES.length; ++i) {
				swatches[i].onclick = function() { setStyle(courseNumber, LABEL_STYLES[i].name); };
			}
			Dashboard.getNicknameInput(courseNumber).oninput = function() { updateNickname(courseNumber); };

			/* We call these here to initialize the style and nickname. */
			setStyle(courseNumber, style);
			updateNickname(courseNumber);
		}

		this.sortLabels();
	}

	sortLabels() {
		function getSortString(child) {
			let $anchor = child
				.children[0] /* media */
				.children[1] /* media-body */
				.children[0] /* il-item-title */
				.children[0] /* a */
			if ($anchor.children.length == 2) {
				return $anchor.children[1].getAttribute('data-adamaticSort') + $anchor.children[1].textContent;
			}
			return 'zm' /* 'za' sorted before, 'zz' after */ + $anchor.textContent;
		}

		let $courses = document.getElementById('adamaticCourses');
		
		let items = Array.from($courses.children);
		items.sort((a, b) => getSortString(a).localeCompare(getSortString(b)));

		while ($courses.firstChild) {
			$courses.removeChild($courses.firstChild);
		}
		items.forEach(item => $courses.appendChild(item));
	}

	getStyle(courseNumber) {
		return STORAGE.labels?.[courseNumber]?.style || 'default';
	}

	static getNickname(courseNumber) {
		return STORAGE.labels?.[courseNumber]?.nickname;
	}

	static getLabelSpan(courseNumber) {
		return document.getElementById(`adamaticLabel${courseNumber}`);
	}

	static getCloseCustomizationPanel(courseNumber) {
		return document.getElementById(`adamaticCloseCustomizationPanel${courseNumber}`);
	}

	static getCustomizationPanel(courseNumber) {
		return document.getElementById(`adamaticCustomizationPanel${courseNumber}`);
	}

	static getSwatches(courseNumber) {
		return document.getElementById(`adamaticSwatches${courseNumber}`).children;
	}

	static getNicknameInput(courseNumber) {
		return document.getElementById(`adamaticNickname${courseNumber}`);
	}

	static getDefaultName(courseNumber) {
		return Dashboard.#defaultNames[courseNumber];
	}

	get $viewsContainer() {
		if (!this._$viewsContainer)
			this._$viewsContainer = document.getElementsByClassName('il-viewcontrol-mode')[0];
		return this._$viewsContainer;
	}
}

const LABEL_STYLES = [
	{ name: 'default' },
	{ name: 'blue', backgroundColor: '#004E8C' },
	{ name: 'yellow', backgroundColor: '#FABD14' },
	{ name: 'green', backgroundColor: '#0F893E' },
	{ name: 'red', backgroundColor: '#E81123' },
	{ name: 'purple', backgroundColor: '#AC008C' },
	{ name: 'cyan', backgroundColor: '#00B6C1'},
	{ name: 'orange', backgroundColor: '#F7630D' },
	{ name: 'magenta', backgroundColor: '#D40078' },
	{ name: 'bluemist', backgroundColor: '#0063AF' },
	{ name: 'purplemist', backgroundColor: '#5B2D90' },
	{ name: 'tan', backgroundColor: '#C6A477' },
	{ name: 'lemonlime', backgroundColor: '#7EC500' },
	{ name: 'apple', backgroundColor: '#00AC56' },
	{ name: 'teal', backgroundColor: '#0099BB' },
	{ name: 'redchalk', backgroundColor: '#C10051' },
	{ name: 'silver', backgroundColor: '#84939A' },
];

let labelStylesheet = '';
for (let i=0; i<LABEL_STYLES.length; ++i) {
	labelStylesheet += `
		span.adamaticStyle-${LABEL_STYLES[i].name} {
			${LABEL_STYLES[i].backgroundColor ? 'color: white;' : ''};
			background-color: ${LABEL_STYLES[i].backgroundColor || 'transparent'};
		}
	`;
}

const STYLESHEET = `
	label.adamaticRemember {
		margin-right: .25em;
		display: inline-block;
		font-size: smaller;
	}
	label.adamaticRemember input[type=checkbox] {
		margin-left: 5px;
		transform: translateY(2px);
	}
	span.adamaticLabel {
		margin-left: 10px;
		border-radius: 5px;
		padding: 0px 5px 2px 5px;
		font-weight: 600;
	}
	div.adamaticCustomizationPanel {
		display: none;
		margin-top: 15px;
		padding: 15px;
		box-shadow: 5px 10px 15px silver;
	}
	div.adamaticCustomizationPanel h3 {
		margin-top: 0px;
	}
	div.adamaticCustomizationPanel .hint {
		font-size: small;
		opacity: .75;
	}
	span.adamaticSwatch {
		display: inline-block;
		width: 1.2em;
		height: 1.2em;
		margin-right: 5px;
		border-style: outset;
		border-width: 2px;
		border-color: white;
	}
	span.adamaticSwatch.selected {
		border-style: inset;
	}
	input.adamaticNicknameInput {
		width: 400px;
	}
` + labelStylesheet;

const CHECKBOX = `
	<label class="adamaticRemember" title="Remember this preference across sessions">
		<input id="adamaticRemember" type="checkbox"> Remember
	</label>
`;

let dropdownButton = id => `
	<li>
		<button class="btn btn-link" id="adamaticCustomize${id}">Customize…</button>
	</li>
`;

let customizationPanel = id => {
	let panel = `
		<div class="adamaticCustomizationPanel" id="adamaticCustomizationPanel${id}">
			<h3>Color</h3>
			<div id="adamaticSwatches${id}">`;
	for (let i=0; i<LABEL_STYLES.length; ++i) {
		panel += `<span class="adamaticSwatch adamaticStyle-${LABEL_STYLES[i].name}"></span>`
	}
	panel += `
			</div>
			<h3 style="margin-top: 1em">Title</h3>
			<input type="text" class="adamaticNicknameInput" id="adamaticNickname${id}" placeholder="${Dashboard.getDefaultName(id)}" value="${Dashboard.getNickname(id) || ""}">
			<br>
			<span class="hint">Use <code>#sort Display</code> to set separate strings for sorting and display</span>
			<br>
			<button style="margin-top: 1.5em" id="adamaticCloseCustomizationPanel${id}" class="btn btn-default">Close</button>
		</div>
	`;
	return panel;
};

let setStyle = (id, style) => {
	let $label = document.getElementById(`adamaticLabel${id}`);
	if (id in (STORAGE.labels || {}))
		$label.classList.remove(`adamaticStyle-${STORAGE.labels[id].style}`);
	$label.classList.add(`adamaticStyle-${style}`);

	let swatches = document.getElementById(`adamaticSwatches${id}`).children;
	for (let i=0; i<swatches.length; ++i) {
		swatches[i].classList.remove('selected');
		if (LABEL_STYLES[i].name === style)
			swatches[i].classList.add('selected');
	}

	if (!STORAGE.labels)
		STORAGE.labels = {};
	if (!(id in (STORAGE.labels || {})))
		STORAGE.labels[id] = { style: undefined };
	STORAGE.labels[id].style = style;

	chrome.storage.sync.set({ 'labels': STORAGE.labels });
};

let updateNickname = id => {
	let pattern = Dashboard.getNicknameInput(id).value;

	STORAGE.labels[id].nickname = pattern;
	chrome.storage.sync.set({ 'labels': STORAGE.labels });

	let $label = document.getElementById(`adamaticLabel${id}`);
	$label.setAttribute('data-adamaticSort', '');
	$label.textContent = Dashboard.getDefaultName(id);

	if (pattern) {
		let display = pattern;

		let split = pattern.split(' ');
		if (pattern.startsWith('#') && split.length >= 2) {
			$label.setAttribute('data-adamaticSort', split[0].substring(1));
			display = split.slice(1).join(' ');
		}
		
		if (display.length > 0) {
			let $i = document.createElement('i');
			$i.textContent = display;
			$label.replaceChildren($i);
		}
	}
};

let STORAGE; chrome.storage.sync.get().then((storage) => { STORAGE = storage || {}; ready(); });

function ready() {
	let dashboard = new Dashboard();
}

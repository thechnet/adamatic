"use strict";

const FETCH_README = 'https://raw.githubusercontent.com/thechnet/adamatic/main/README.md';
const FETCH_CHANGELOG = 'https://raw.githubusercontent.com/thechnet/adamatic/main/CHANGELOG.md';

function parseReadme(text) {
	let sections = {};

	let lines = text.split('\n');
	let section = undefined;
	for (let i = 0; i < lines.length; ++i) {
		if (lines[i] === '<!--@end-->') {
			section = undefined;
			continue;
		}
		let sectionDeclaration = lines[i].match(/^<!--@begin ([a-z]+)-->$/);
		if (sectionDeclaration) {
			section = sectionDeclaration[1];
			if (!(section in sections))
				sections[section] = [];
			continue;
		}
		if (section) {
			sections[section].push(lines[i]);
		}
	}

	return sections;
}

function parseChangelog(text) {
	let versions = {
		latest: undefined,
		unreleased: {
			lines: []
		}
	};

	let lines = text.split('\n');
	let currentVersion = undefined;
	for (let i = 0; i < lines.length; ++i) {
		/* Skip reference declarations. */
		if (lines[i].match(/^\[.+\]: .*$/)) {
			continue;
		}

		let unreleasedDeclaration = lines[i].match(/^## \[Unreleased\]/i);
		if (unreleasedDeclaration) {
			currentVersion = 'unreleased';
			continue;
		}

		let versionDeclaration = lines[i].match(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/);
		if (versionDeclaration) {
			currentVersion = versionDeclaration[1];
			versions[currentVersion] = {
				date: versionDeclaration[2],
				lines: []
			};
			if (!versions.latest) {
				versions.latest = currentVersion;
			}
			continue;
		}

		if (currentVersion) {
			versions[currentVersion].lines.push(lines[i]);
		}
	}

	return versions;
}

function renderReadme(text) {
	let sections = parseReadme(text);

	document.getElementById('abstract').innerHTML = marked.parse(sections.abstract.join('\n'));

	document.getElementById('highlights').innerHTML = marked.parse(sections.table.join('\n'));
}

function renderChanges(text, requestedVersion) {
	let versions = parseChangelog(text);

	if (requestedVersion === 'latest') {
		requestedVersion = versions.latest;
	}

	if (!(requestedVersion in versions)) {
		console.error('Requested version not in parsed versions.');
		return;
	}
	
	if (versions[requestedVersion].lines.length) {
		document.getElementById('changes-title').textContent = requestedVersion === 'unreleased' ? 'Upcoming Changes' : 'What\'s New in ' + requestedVersion;
		document.getElementById('changelog').innerHTML = marked.parse(versions[requestedVersion].lines.join('\n'));
		
		document.getElementById('changes').style.display = 'block';
	}
}

let requestedVersion = new URLSearchParams(window.location.search).get('changes');

async function main() {
	renderReadme(await (await fetch(FETCH_README)).text());
	if (requestedVersion) {
		renderChanges(await (await fetch(FETCH_CHANGELOG)).text(), requestedVersion);
	}

	Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
		document.getElementById('main').style.opacity = 1;
	});
}

main();

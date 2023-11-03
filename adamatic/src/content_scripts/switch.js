let prefix = 'ADAMatic (switch): ';

let DOM_organisation = document.querySelector('div[title="Universitäten: Universität Basel"]');
if (!DOM_organisation) {
	alert(prefix + 'Cannot find organisation.');
} else {
	DOM_organisation.click();
}

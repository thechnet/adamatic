let prefix = 'ADAMatic (switch): ';

const organisation = 'Universität Basel';

let DOM_organisation = null;
let DOM_organisations = document.getElementsByClassName('idd_listItem idd_listItem_Nested');
for (let i=0; i<DOM_organisations.length; i++) {
	if (DOM_organisations[i].title.slice(-organisation.length) == organisation)
		DOM_organisation = DOM_organisations[i];
}

if (!DOM_organisation)
	alert(prefix + 'Cannot find organisation.');
else
	DOM_organisation.click();

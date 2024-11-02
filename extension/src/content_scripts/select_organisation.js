"use strict";

const ORGANISATION = 'Universität Basel';

let $ORGANISATIONS = document.getElementsByClassName('idd_listItem idd_listItem_Nested');
let $ORGANISATION = null;
for (let i = 0; i < $ORGANISATIONS.length; ++i) {
	if ($ORGANISATIONS[i].title.slice(-ORGANISATION.length) === ORGANISATION)
		$ORGANISATION = $ORGANISATIONS[i];
}

if (!$ORGANISATION)
	alert(`ADAMatic: Cannot find '${ORGANISATION}'. Try reloading the page; if the issue persists, please contact the developer.`);
else
	$ORGANISATION.click();

const PREFIX = 'ADAMatic (switch): ';

const ORGANISATION = 'Universität Basel';

let $ORGANISATION = null;
const $ORGANISATIONS = document.getElementsByClassName('idd_listItem idd_listItem_Nested');
for (let i=0; i<$ORGANISATIONS.length; ++i) {
	if ($ORGANISATIONS[i].title.slice(-ORGANISATION.length) == ORGANISATION)
		$ORGANISATION = $ORGANISATIONS[i];
}

if (!$ORGANISATION)
	alert(PREFIX + `Cannot find '${ORGANISATION}'. Try reloading the page; if the issue persists, please contact the developer.`);
else
	$ORGANISATION.click();

"use strict";

chrome.runtime.onInstalled.addListener(event => {
	if (event.reason === chrome.runtime.OnInstalledReason.INSTALL) {
		chrome.tabs.create({ url: 'https://thechnet.github.io/adamatic' });
	} else if (event.reason === chrome.runtime.OnInstalledReason.UPDATE) {
		chrome.tabs.create({ url: 'https://thechnet.github.io/adamatic?changes=2.1.0' });
	}
});

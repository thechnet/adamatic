chrome.runtime.onInstalled.addListener((object) => {
	if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
		chrome.tabs.create({ url: "https://thechnet.github.io/adamatic" });
	} else if (object.reason === chrome.runtime.OnInstalledReason.UPDATE) {
		chrome.tabs.create({ url: "https://thechnet.github.io/adamatic?changes=latest" });
	}
});

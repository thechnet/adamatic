# ADAMatic

The SWITCHaai login process for ADAM, the learning management system of the University of Basel, can get annoying when one is required to repeat it multiple times throughout a typical day. ADAMatic removes this inconvenience by automating the login process.

Once ADAMatic is installed, provide your SWITCH edu-ID credentials in the extension's popup window. Now, whenever you visit the ADAM login page (https://adam.unibas.ch/login.php), ADAMatic automatically performs the login process for you.

Your credentials are stored and, at least with Chrome, synchronized between your devices by your browser. They are removed when you remove the extension, and ADAMatic never interacts with them outside the intended functionality. **Be aware that your credentials are stored unencrypted!** That is the trade-off you make for increased convenience – use this extension at your own risk.

## Installation

ADAMatic is available [in the Chrome Web Store](https://chromewebstore.google.com/detail/falhcaokchhdmcihdbjkgmmmgkdiijpd).

Alternatively, you can install it from source:

- Download this repository and move it to a permanent location.
- In your Chromium-based browser, open the extensions page and activate the developer mode.
- Click *Load unpacked* and select the "adamatic" directory *within* the downloaded repository.

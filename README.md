# ADAMatic

The SWITCHaai login process for ADAM, the learning management system of the University of Basel, can get annoying when one is required to repeat it multiple times throughout a typical day. ADAMatic removes this inconvenience by automating the login process.

Once ADAMatic is installed, provide your SWITCH edu-ID credentials in the extension's popup window. Now, whenever you visit the ADAM login page (https://adam.unibas.ch/login.php), ADAMatic automatically performs the login process for you.

Your credentials are stored and synchronized between your devices by Chrome. They are removed when you remove the extension, and ADAMatic never interacts with them outside the intended functionality. **Be aware that your credentials are stored unencrypted!** That is the tradeoff you make for increased convenience – use the extension at your own risk.

## Installing from source

- Download the repository and move it to a permanent location.
- In Chrome, open the extensions page and activate the developer mode.
- Click *Load unpacked*, and select the "adamatic" directory *within* the downloaded repository.

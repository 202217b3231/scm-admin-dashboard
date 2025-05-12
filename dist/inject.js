function loadScript() {
  const scriptElement = document.createElement("script");
  scriptElement.src = chrome.runtime.getURL("script.js");
  scriptElement.onload = function () {
    console.log("script.js loaded successfully.");
    this.remove();
  };
  (document.head || document.documentElement).appendChild(scriptElement);
}

loadScript();

function getMessage(act) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === act) {
      console.log("Message received from popup:", message);

      window.postMessage({ action: act }, "*");

      sendResponse({ success: true, message: "Message sent to page context." });
    }
  });
}

getMessage("infoAlert");
getMessage("errAlert");
getMessage("warnAlert");

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

function getMessage(action) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === action) {
      console.log("Message received from popup:", message);

      window.postMessage({ action: action }, "*");

      sendResponse({ success: true, message: "Message sent to page context." });
    }
  });
}

getMessage("infoAlert");
getMessage("errAlert");
getMessage("warnAlert");

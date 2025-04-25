chrome.action.onClicked.addListener((tab) => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    console.log(
      "chrome.runtime.openOptionsPage is not available or options_page not set."
    );
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
  }
});

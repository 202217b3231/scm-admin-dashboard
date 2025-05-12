function sendMessage(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: action }, (response) => {
      if (response?.success) {
        console.log(response.message);
      } else {
        console.error(response?.message || "Failed to trigger alert.");
      }
    });
  });
}
document
  .getElementById("inf")
  .addEventListener("click", () => sendMessage("infoAlert"));
document
  .getElementById("err")
  .addEventListener("click", () => sendMessage("errAlert"));
document
  .getElementById("warn")
  .addEventListener("click", () => sendMessage("warnAlert"));

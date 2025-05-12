function info() {
  let gform = window?.g_form || frames[0]?.g_form;
  if (gform) {
    gform.addInfoMessage("This is an info message from g_form!");
  } else {
    console.log("g_form is not available on this page.");
  }
}
function error() {
  let gform = window?.g_form || frames[0]?.g_form;
  if (gform) {
    gform.addErrorMessage("This is an error message from g_form!");
  } else {
    console.log("g_form is not available on this page.");
  }
}
function warning() {
  let gform = window?.g_form || frames[0]?.g_form;
  gform?.addWarningMessage("This is a warning message from g_form!");
}

window.addEventListener("message", (event) => {
  if (event.source !== window) {
    return;
  }

  if (event.data.action === "infoAlert") {
    info();
  }
  if (event.data.action === "errAlert") {
    error();
  }
  if (event.data.action === "warnAlert") {
    warning();
  }
});

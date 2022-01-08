// Provides a function that can be used to open a odd display and send data to it.
// User provides the URL? b/c we don't know where they're hosting the display.
// Their display could be a parcel thinger...
// So should we provide a package for the display? Or an app for the display?
// If package, they'd build the display on their own by setting an entrypoing and a js main that renders the package.
// If app, we'd do the building of the app for them... then how would they host?

export default function launch(uiURI: URL) {
  // @ts-ignore
  const id = crypto.randomUUID();
  uiURI.searchParams.append("id", id);
  const wnd = window.open(
    uiURI,
    "Counter UI",
    "toolbar=no,location=no,directories=no,status=no,menubar=no"
      + ",scrollbars=yes,resizable=yes,fullscreen=yes",
  );

  if (wnd == null) {
    throw new Error('Could not open Counter UI at ' + uiURI.toString());
  }

  // Listen for messages coming from wnd
  const wndListener = (e) => {
    if (e.data.source !== id) {
      return;
    }

    window.removeEventListener('message', wndListener);
    wnd.postMessage({
      /* All data up till current time */
    }, "*");
  };
  window.addEventListener("message", wndListener);
}
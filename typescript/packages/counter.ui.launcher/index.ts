// Provides a function that can be used to open a odd display and send data to it.
// User provides the URL? b/c we don't know where they're hosting the display.
// Their display could be a parcel thinger...
// So should we provide a package for the display? Or an app for the display?
// If package, they'd build the display on their own by setting an entrypoing and a js main that renders the package.
// If app, we'd do the building of the app for them... then how would they host?

import { aggregatedMeasurements, Measurement, subscribe } from "@strut/counter/counter";

export default function launch(uiURI: URL) {
  // @ts-ignore
  const childId = crypto.randomUUID();
  // @ts-ignore
  const myId = crypto.randomUUID();
  uiURI.searchParams.append("window-id", childId);
  uiURI.searchParams.append("opener-id", myId);

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
    if (e.data.source !== childId) {
      return;
    }

    window.removeEventListener('message', wndListener);

    // Send out the catchup data
    wnd.postMessage({
      source: myId,
      event: "catchup",
      payload: aggregatedMeasurements,
    }, "*");

    // Then subscribe for update data so we don't send
    // a catchup and update that have the same data
    subscribe(processNewData);
  };
  window.addEventListener("message", wndListener);

  function processNewData(batch: Map<string, Measurement[]>) {
    wnd.postMessage({
      source: myId,
      event: "update",
      payload: batch,
    });
  }
}

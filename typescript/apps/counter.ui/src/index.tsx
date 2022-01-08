import * as React from "react";
import { render } from "react-dom";

const el = document.getElementById('counter-ui-root');

function App() {
  return <div>Welcome to Counter UI!</div>;
}

render(<App />, el);

// Grab the window id
// post to our parent that we're alive
// wait for catchup data
// start rendering

const searchParams = new URL(location.href).searchParams;
const myId = searchParams.get('window-id');
const openerId = searchParams.get('opener-id');

window.addEventListener("message", (e) => {
  if (e.data.source !== openerId) {
    return;
  }

  switch (e.data.event) {
    case "catchup":
      console.log(e.data.payload);
      break;
    case "update":
      console.log(e.data.payload);
      break;
  }
});

if (window.opener != null) {
  window.opener.postMessage({
    source: myId,
    even: "ready",
  }, "*");
}

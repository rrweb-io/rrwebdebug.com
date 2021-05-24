function allowedVersion(version) {
  const allVersions = ["0.7.1"];
  return allVersions.includes(version);
}

function scriptSRC(version) {
  if (!allowedVersion(version)) return;
  return `https://cdn.jsdelivr.net/npm/rrweb-player@${version}/dist/index.js`;
}
function styleHref(version) {
  if (!allowedVersion(version)) return;
  return `https://cdn.jsdelivr.net/npm/rrweb-player@${version}/dist/style.css`;
}

function playVideo(events) {
  const component = new rrwebPlayer({
    target: document.body,
    data: {
      events,
      skipInactive: true,
      showDebug: true,
      showWarning: true,
      autoPlay: true,
      mouseTail: {
        strokeStyle: "yellow",
      },
    },
  });
  window.$c = component;
  component.addEventListener("finish", () => console.log("finish"));
}

async function startPlayer() {
  const location = new URL(document.location);
  const gistURL = location.serachParams.get("url");
  const version = location.serachParams.get("version");
  try {
    const eventsRequest = await fetch(gistURL);
    const events = await eventsRequest.json();
  } catch (error) {
    alert(error);
  }

  const styleEl = document.createElement("link");
  styleEl.setAttribute("rel", "stylesheet");
  styleEl.setAttribute("href", styleHref(version));
  document.head.appendChild(styleEl);

  const scriptEl = document.createElement("script");
  scriptEl.setAttribute("type", "script/javascript");
  scriptEl.setAttribute("src", scriptSRC(version));
  scriptEl.addEventListener("load", function () {
    playVideo(events);
  });

  document.head.appendChild(scriptEl);
}

document.onload = startPlayer();

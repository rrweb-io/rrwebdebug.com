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

function getGistId(url) {
  const match = /gist.github.com\/[^/]+\/(\w+)/.exec(url);
  return match?.[1] || false;
}

async function startPlayer() {
  const location = new URL(document.location);
  const url = location.searchParams.get("url");
  const version = location.searchParams.get("version");
  let events;
  const gistId = getGistId(url);
  if (gistId) {
    try {
      const gistApiRequest = await fetch(
        `https://api.github.com/gists/${gistId}`
      );
      const apiResponse = await gistApiRequest.json();
      const files = Object.values(apiResponse.files);
      events = JSON.parse(files[0].content);
    } catch (error) {
      alert("something went wrong, please check the console");
      console.error(error);
    }
  } else {
    try {
      const eventsRequest = await fetch(url);
      events = await eventsRequest.json();
    } catch (error) {
      alert("something went wrong, please check the console");
      console.error(error);
    }
  }

  const styleEl = document.createElement("link");
  styleEl.setAttribute("rel", "stylesheet");
  styleEl.setAttribute("href", styleHref(version));
  document.head.appendChild(styleEl);

  const scriptEl = document.createElement("script");
  scriptEl.setAttribute("src", scriptSRC(version));
  scriptEl.addEventListener("load", function () {
    playVideo(events);
  });

  document.head.appendChild(scriptEl);
}

document.onload = startPlayer();

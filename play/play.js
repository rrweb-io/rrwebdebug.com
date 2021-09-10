function allowedVersion(version) {
  const allVersions = ["0.7.1", "0.7.2", "0.7.3", "0.7.4", "0.7.5", "0.7.6"];
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
    target: document.getElementById("player"),
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
  window.events = events;
  document.querySelector('.loading').style.display = "none";
  component.addEventListener("finish", () => console.log("finish"));
}

function getGistId(url) {
  const match = /gist.github.com\/[^/]+\/(\w+)/.exec(url);
  return match?.[1] || false;
}

function getJSONBlobId(url) {
  const match = /https:\/\/jsonblob.com\/([\w\-]+)/.exec(url);
  return match?.[1] || false;
}

async function startPlayer() {
  const location = new URL(document.location);
  const url = location.searchParams.get("url");
  const version = location.searchParams.get("version");
  let events;
  const gistId = getGistId(url);
  const jsonBlobId = getJSONBlobId(url);
  if (gistId) {
    try {
      const gistApiRequest = await fetch(
        `https://api.github.com/gists/${gistId}`
      );
      const apiResponse = await gistApiRequest.json();
      const files = Object.values(apiResponse.files);
      // if js
      // Function('"use strict";return (' + js.replace(/^\s*(const|let|var)\s\w+\s*=\s*/, '').replace(/;[\s\n]*$/, '') + ')')()
      events = JSON.parse(files[0].content);
    } catch (error) {
      alert("something went wrong, please check the console");
      console.error(error);
    }
  } else if (jsonBlobId) {
    try {
      const jsonBlobApiRequest = await fetch(
        `https://jsonblob.com/api/v1/get/${jsonBlobId}`
      );
      events = await jsonBlobApiRequest.json();
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
  document.querySelector('a.json').setAttribute('href', url);
  document.querySelector('a.json').innerText = url;
}

document.onload = startPlayer();

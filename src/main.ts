import "./style.css";

import versionsJson from "./versions.json";

function onLoad() {
  document.getElementById("versions")!.innerHTML = Object.entries(versionsJson)
    .map(([version, config]) => {
      const { rrwebVersion } = config;
      const isDefault = "default" in config && config.default;

      return `<option value="${version}" ${
        isDefault ? "selected" : ""
      } =>${version} (rrweb v${rrwebVersion})</option>`;
    })
    .join("");

  console.log("Welcome to rrwebdebug.com!");
}

document.addEventListener("DOMContentLoaded", onLoad);

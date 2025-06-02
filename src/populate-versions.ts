import versionsJson from "./versions.json";
export function populateVersions(selectedVersion?: string) {
  document.getElementById("versions")!.innerHTML = Object.entries(versionsJson)
    .map(([version, config]) => {
      const { rrwebVersion } = config;
      const isDefault = "default" in config && config.default;

      return `<option value="${version}" ${isDefault ? "selected" : ""
        }>${version} (rrweb v${rrwebVersion})</option>`;
    })
    .join("");

  if (selectedVersion) {
    (document.getElementById("versions") as HTMLSelectElement).value =
      selectedVersion;
  }
}

export default populateVersions;

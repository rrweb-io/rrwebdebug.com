import { populateVersions } from "./populate-versions";
import "./style.css";

function onLoad() {
  populateVersions();

  console.log("Welcome to rrwebdebug.com!");
}

document.addEventListener("DOMContentLoaded", onLoad);

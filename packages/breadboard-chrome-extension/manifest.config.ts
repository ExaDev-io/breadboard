import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

export default defineManifest(async () => ({
  manifest_version: 3,
  name: "Breadboard Runner",
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  description: "Basic Chrome extension for running Breadboard.",
  action: {
    default_popup: "src/pages/popup/index.html",
    default_title: "Breadboard Summarisation",
  },
  background: {
    service_worker: "src/pages/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      js: ["src/content.ts"],
      matches: ["<all_urls>"],
    },
  ],
  permissions: [
    "scripting",
    "tabs",
    "activeTab",
    "tabCapture",
    "storage",
    "contextMenus",
    "downloads",
    "fileBrowserHandler",
  ],
  host_permissions: ["https://*/*", "http://*/*"],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'",
  },
  icons: {
    "16": "images/icon-32.png",
    "32": "images/icon-32.png",
  },
  web_accessible_resources: [
    {
      resources: [
        "src/pages/permission/index.html",
        "src/pages/permission/index.js",
      ],
      matches: ["<all_urls>"],
    },
  ],
}));

// src/settings.js
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");

function getSettingsPath() {
  return path.join(os.homedir(), ".claude", "settings.json");
}

function readSettings(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const content = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(content);
  } catch {
    throw new Error(
      `Failed to parse ${filePath}. Fix the JSON manually or delete the file.`
    );
  }
}

function writeSettings(filePath, settings) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const content = JSON.stringify(settings, null, 2) + "\n";
  // Atomic write: write to temp file, then rename
  const tmpPath = filePath + "." + crypto.randomBytes(4).toString("hex") + ".tmp";
  fs.writeFileSync(tmpPath, content, "utf8");
  fs.renameSync(tmpPath, filePath);
}

module.exports = { readSettings, writeSettings, getSettingsPath };

#!/usr/bin/env node

// Node.js version check
const [major] = process.versions.node.split(".").map(Number);
if (major < 20) {
  console.error(`Error: unspin requires Node.js >= 20. You have ${process.version}.`);
  process.exit(1);
}

const path = require("node:path");
const { readSettings, writeSettings, getSettingsPath } = require("../src/settings");
const { formatVerbs, formatVerbList, isUnspinGenerated } = require("../src/formatter");
const verbs = require("../src/verbs.json");
const pkg = require("../package.json");

const args = process.argv.slice(2);
// Allow overriding settings path for testing
const settingsPath = process.env.UNSPIN_SETTINGS_PATH || getSettingsPath();

function printHelp() {
  console.log(`unspin v${pkg.version}

Add plain English explanations to Claude Code's spinner verbs.

Usage:
  npx unspin            Install annotated verbs into settings.json
  npx unspin --undo     Remove spinnerVerbs from settings.json
  npx unspin --force    Override existing custom spinnerVerbs
  npx unspin --list     Print all verbs with explanations
  npx unspin --dry-run  Show what would be written, without writing
  npx unspin --help     Show this help
  npx unspin --version  Show version`);
}

function install(force) {
  let settings;
  try {
    settings = readSettings(settingsPath);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  if (settings.spinnerVerbs && !isUnspinGenerated(settings.spinnerVerbs) && !force) {
    console.error(
      "Error: Custom spinnerVerbs already exist in settings.json.\n" +
        "Use --force to override them."
    );
    process.exit(1);
  }

  const annotated = formatVerbs(verbs);
  settings.spinnerVerbs = { mode: "replace", verbs: annotated };

  try {
    writeSettings(settingsPath, settings);
  } catch (err) {
    console.error(`Error writing settings: ${err.message}`);
    process.exit(1);
  }

  console.log(`unspin: ${annotated.length - 1} annotated verbs installed.`);
  console.log(`Written to: ${settingsPath}`);
}

function undo() {
  let settings;
  try {
    settings = readSettings(settingsPath);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  if (!settings.spinnerVerbs) {
    console.log("unspin: No spinnerVerbs found in settings. Nothing to remove.");
    return;
  }

  delete settings.spinnerVerbs;

  try {
    writeSettings(settingsPath, settings);
  } catch (err) {
    console.error(`Error writing settings: ${err.message}`);
    process.exit(1);
  }

  console.log("unspin: spinnerVerbs removed. Claude Code defaults restored.");
}

function list() {
  const lines = formatVerbList(verbs);
  lines.forEach((line) => console.log(line));
}

function dryRun() {
  let settings;
  try {
    settings = readSettings(settingsPath);
  } catch {
    settings = {};
  }
  const annotated = formatVerbs(verbs);
  settings.spinnerVerbs = { mode: "replace", verbs: annotated };
  console.log(JSON.stringify(settings, null, 2));
}

// Dispatch
if (args.includes("--help") || args.includes("-h")) {
  printHelp();
} else if (args.includes("--version") || args.includes("-v")) {
  console.log(pkg.version);
} else if (args.includes("--list")) {
  list();
} else if (args.includes("--dry-run")) {
  dryRun();
} else if (args.includes("--undo")) {
  undo();
} else {
  install(args.includes("--force"));
}

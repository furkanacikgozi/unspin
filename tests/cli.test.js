// tests/cli.test.js
const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const CLI = path.join(__dirname, "..", "bin", "unspin.js");
let tmpDir;
let settingsPath;

function run(args = [], env = {}) {
  return execFileSync("node", [CLI, ...args], {
    encoding: "utf8",
    env: { ...process.env, UNSPIN_SETTINGS_PATH: settingsPath, ...env },
  });
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "unspin-cli-"));
  settingsPath = path.join(tmpDir, "settings.json");
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("unspin install", () => {
  it("creates settings with spinnerVerbs", () => {
    const output = run();
    assert.match(output, /installed/i);
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    assert.equal(settings.spinnerVerbs.mode, "replace");
    assert.equal(settings.spinnerVerbs.verbs[0], "__unspin__");
    assert.ok(settings.spinnerVerbs.verbs.length > 100);
  });

  it("preserves existing settings", () => {
    fs.writeFileSync(settingsPath, JSON.stringify({ theme: "dark" }));
    run();
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    assert.equal(settings.theme, "dark");
    assert.ok(settings.spinnerVerbs);
  });

  it("warns on existing custom verbs without --force", () => {
    fs.writeFileSync(
      settingsPath,
      JSON.stringify({ spinnerVerbs: { mode: "replace", verbs: ["Custom"] } })
    );
    assert.throws(() => run(), { status: 1 });
  });

  it("overrides custom verbs with --force", () => {
    fs.writeFileSync(
      settingsPath,
      JSON.stringify({ spinnerVerbs: { mode: "replace", verbs: ["Custom"] } })
    );
    const output = run(["--force"]);
    assert.match(output, /installed/i);
  });

  it("is idempotent — updates existing unspin verbs", () => {
    run();
    const output = run();
    assert.match(output, /updated|installed/i);
  });
});

describe("unspin --undo", () => {
  it("removes spinnerVerbs from settings", () => {
    run(); // install first
    const output = run(["--undo"]);
    assert.match(output, /removed|restored/i);
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    assert.equal(settings.spinnerVerbs, undefined);
  });
});

describe("unspin --list", () => {
  it("prints verb list to stdout", () => {
    const output = run(["--list"]);
    assert.match(output, /Prestidigitating\s+\u2192\s+doing magic tricks/);
    assert.match(output, /Cogitating\s+\u2192\s+thinking deeply/);
  });
});

describe("unspin --dry-run", () => {
  it("prints JSON without writing", () => {
    const output = run(["--dry-run"]);
    assert.match(output, /"spinnerVerbs"/);
    assert.equal(fs.existsSync(settingsPath), false);
  });
});

describe("unspin with malformed JSON", () => {
  it("shows error on install with malformed settings", () => {
    fs.writeFileSync(settingsPath, "not json{{{");
    assert.throws(() => run(), { status: 1 });
  });

  it("shows error on undo with malformed settings", () => {
    fs.writeFileSync(settingsPath, "not json{{{");
    assert.throws(() => run(["--undo"]), { status: 1 });
  });

  it("dry-run handles missing settings gracefully", () => {
    const output = run(["--dry-run"]);
    assert.match(output, /"spinnerVerbs"/);
  });

  it("dry-run merges with existing settings", () => {
    fs.writeFileSync(settingsPath, JSON.stringify({ theme: "dark" }));
    const output = run(["--dry-run"]);
    const parsed = JSON.parse(output);
    assert.equal(parsed.theme, "dark");
    assert.ok(parsed.spinnerVerbs);
  });
});

describe("unspin --help", () => {
  it("prints usage info", () => {
    const output = run(["--help"]);
    assert.match(output, /unspin/i);
    assert.match(output, /--undo/);
  });
});

describe("unspin --version", () => {
  it("prints version", () => {
    const output = run(["--version"]);
    assert.match(output, /\d+\.\d+\.\d+/);
  });
});

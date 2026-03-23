// tests/settings.test.js
const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { readSettings, writeSettings, getSettingsPath } = require("../src/settings");

// Use a temp dir to avoid touching real ~/.claude
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "unspin-test-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("readSettings", () => {
  it("returns empty object if file does not exist", () => {
    const result = readSettings(path.join(tmpDir, "nope.json"));
    assert.deepEqual(result, {});
  });

  it("parses existing settings", () => {
    const p = path.join(tmpDir, "settings.json");
    fs.writeFileSync(p, JSON.stringify({ theme: "dark" }));
    const result = readSettings(p);
    assert.deepEqual(result, { theme: "dark" });
  });

  it("throws on malformed JSON", () => {
    const p = path.join(tmpDir, "settings.json");
    fs.writeFileSync(p, "not json{{{");
    assert.throws(() => readSettings(p), { message: /Failed to parse/ });
  });
});

describe("writeSettings", () => {
  it("writes settings with 2-space indent and trailing newline", () => {
    const p = path.join(tmpDir, "settings.json");
    writeSettings(p, { foo: "bar" });
    const content = fs.readFileSync(p, "utf8");
    assert.equal(content, '{\n  "foo": "bar"\n}\n');
  });

  it("creates parent directory if missing", () => {
    const p = path.join(tmpDir, "sub", "dir", "settings.json");
    writeSettings(p, { ok: true });
    assert.equal(fs.existsSync(p), true);
  });

  it("preserves existing settings when merging", () => {
    const p = path.join(tmpDir, "settings.json");
    fs.writeFileSync(p, JSON.stringify({ theme: "dark", other: 1 }));
    const existing = readSettings(p);
    existing.spinnerVerbs = { mode: "replace", verbs: ["test"] };
    writeSettings(p, existing);
    const result = JSON.parse(fs.readFileSync(p, "utf8"));
    assert.equal(result.theme, "dark");
    assert.equal(result.other, 1);
    assert.deepEqual(result.spinnerVerbs, { mode: "replace", verbs: ["test"] });
  });
});

describe("getSettingsPath", () => {
  it("returns a path ending in .claude/settings.json", () => {
    const p = getSettingsPath();
    assert.ok(p.endsWith(path.join(".claude", "settings.json")));
  });
});

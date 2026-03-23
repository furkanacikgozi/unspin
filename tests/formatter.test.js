// tests/formatter.test.js
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { formatVerbs, formatVerbList, isUnspinGenerated } = require("../src/formatter");

describe("formatVerbs", () => {
  it("returns annotated verb strings with sentinel", () => {
    const verbs = { Cogitating: "thinking deeply", Brewing: "brewing" };
    const result = formatVerbs(verbs);
    assert.equal(result[0], "__unspin__");
    assert.equal(result[1], "Brewing [brewing]");
    assert.equal(result[2], "Cogitating [thinking deeply]");
    assert.equal(result.length, 3);
  });

  it("sorts verbs alphabetically", () => {
    const verbs = { Zesting: "adding zest", Baking: "baking" };
    const result = formatVerbs(verbs);
    assert.equal(result[1], "Baking [baking]");
    assert.equal(result[2], "Zesting [adding zest]");
  });
});

describe("formatVerbList", () => {
  it("returns human-readable lines with arrow separator", () => {
    const verbs = { Cogitating: "thinking deeply" };
    const result = formatVerbList(verbs);
    assert.deepEqual(result, ["Cogitating  \u2192  thinking deeply"]);
  });
});

describe("isUnspinGenerated", () => {
  it("returns true for unspin-generated verbs", () => {
    assert.equal(
      isUnspinGenerated({ mode: "replace", verbs: ["__unspin__", "Foo [bar]"] }),
      true
    );
  });

  it("returns false for user-custom verbs", () => {
    assert.equal(
      isUnspinGenerated({ mode: "replace", verbs: ["MyCustomVerb"] }),
      false
    );
  });

  it("returns false for null/undefined", () => {
    assert.equal(isUnspinGenerated(null), false);
    assert.equal(isUnspinGenerated(undefined), false);
  });
});

describe("verbs.json integrity", () => {
  it("has 185 verbs with non-empty meanings", () => {
    const verbs = require(path.join(__dirname, "..", "src", "verbs.json"));
    const keys = Object.keys(verbs);
    assert.equal(keys.length, 185);
    for (const key of keys) {
      assert.equal(typeof verbs[key], "string", `${key} should have a string value`);
      assert.ok(verbs[key].length > 0, `${key} should have a non-empty meaning`);
    }
  });
});

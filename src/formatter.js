// src/formatter.js
const SENTINEL = "__unspin__";

function formatVerbs(verbs) {
  const sorted = Object.keys(verbs).sort();
  const annotated = sorted.map((verb) => `${verb} [${verbs[verb]}]`);
  return [SENTINEL, ...annotated];
}

function formatVerbList(verbs) {
  return Object.keys(verbs)
    .sort()
    .map((verb) => `${verb}  \u2192  ${verbs[verb]}`);
}

function isUnspinGenerated(spinnerVerbs) {
  return !!(
    spinnerVerbs &&
    Array.isArray(spinnerVerbs.verbs) &&
    spinnerVerbs.verbs[0] === SENTINEL
  );
}

module.exports = { formatVerbs, formatVerbList, isUnspinGenerated, SENTINEL };

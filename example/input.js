const getInput = () => [{ test1: "aa", test2: "aaaa" }];

if (typeof window !== "undefined") {
  window.input = getInput();
} else {
  module.exports = getInput();
}

const getSetting = () => ({
  pageSize: { width: 210, height: 297 },
  fontName: "SauceHanSerifJP",
});

if (typeof window !== "undefined") {
  window.setting = getSetting();
} else {
  module.exports = getSetting();
}

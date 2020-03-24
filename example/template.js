const getTemplate = () => ({
  background: null,
  position: {
    test1: {
      position: { x: 0, y: 0 },
      width: 50,
      type: "qrcode"
    },
    test2: {
      position: { x: 60, y: 60 },
      width: 50,
      alignment: "left",
      fontSize: 8,
      characterSpacing: 0,
      type: "text",
      lineHeight: 1
    }
  },
  pageSize: {
    width: 100,
    height: 100
  }
});

if (typeof window !== "undefined") {
  window.template = getTemplate();
} else {
  module.exports = getTemplate();
}

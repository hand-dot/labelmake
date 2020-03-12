const fs = require("fs");
const labelmake = require("../../dist/labelmake");
const template = {
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
};
const input = [{ test1: "aa", test2: "aa" }];
labelmake({ input, template }).then(pdf => {
  fs.writeFileSync(__dirname + "/index.pdf", pdf);
});

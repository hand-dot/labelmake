const fs = require("fs");
const labelmake = require("../../dist/labelmake.min");
const template = require("../template");
const inputs = require("../inputs");
const font = require("../font");

labelmake({ inputs, template, font }).then((pdf) => {
  fs.writeFileSync(__dirname + "/index.pdf", pdf);
});

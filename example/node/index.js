const fs = require("fs");
const labelmake = require("../../dist/labelmake.min");
const template = require("../template");
const input = require("../input");
const font = require("../font");

labelmake({ input, template, font }).then(pdf => {
  fs.writeFileSync(__dirname + "/index.pdf", pdf);
});

const fs = require("fs");
const labelmake = require("../../dist/labelmake.min");
const template = require("../template");
const input = require("../input");

labelmake({ input, template }).then(pdf => {
  fs.writeFileSync(__dirname + "/index.pdf", pdf);
});

const fs = require("fs");
const labelmake = require("../../dist/labelmake.min");
const templates = require("../templates");
const inputs = require("../inputs");
const setting = require("../setting");
const font = require("../font");

labelmake({ inputs, templates, setting, font }).then((pdf) => {
  fs.writeFileSync(__dirname + "/index.pdf", pdf);
});

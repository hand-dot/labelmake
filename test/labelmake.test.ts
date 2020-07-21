// import SauceHanSansJP from "./fonts/SauceHanSansJP";
// import SauceHanSerifJP from "./fonts/SauceHanSerifJP";
const fs = require("fs");
import labelmake from "../src/labelmake";
const PDFParser = require("pdf2json");
import templateData from "./templates";

const font: any = {
  SauceHanSansJP: fs.readFileSync(__dirname + `/fonts/SauceHanSansJP.ttf`),
  SauceHanSerifJP: fs.readFileSync(__dirname + `/fonts/SauceHanSerifJP.ttf`),
};

const getPdf = (pdfFilePath: string) => {
  const pdfParser = new PDFParser();
  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", reject);
    pdfParser.on("pdfParser_dataReady", resolve);
    pdfParser.loadPDF(pdfFilePath);
  });
};

const getPath = (dir: string, fileName: string) =>
  __dirname + `/${dir}/${fileName}`;
const getTmpPath = (fileName: string) => getPath("tmp", fileName);
const getAssertPath = (fileName: string) => getPath("assert", fileName);

describe("labelmake integrate test", () => {
  afterAll(() => {
    const dir = __dirname + "/tmp";
    fs.readdir(dir, (err: any, files: any) => {
      if (err) {
        throw err;
      }
      files.forEach((file: any) => {
        if (file !== ".gitkeep") {
          fs.unlink(`${dir}/${file}`, (err: any) => {
            if (err) {
              throw err;
            }
          });
        }
      });
    });
  });
  describe("use labelmake.jp template", () => {
    const entries = Object.entries(templateData);
    for (let l = 0; l < entries.length; l++) {
      const [key, template] = entries[l];
      test(`snapshot ${key}`, async () => {
        const hrstart = process.hrtime();
        const inputs = template.sampledata;
        const pdf = await labelmake({ inputs, template, font });
        const tmpFile = getTmpPath(`${key}.pdf`);
        const assertFile = getAssertPath(`${key}.pdf`);
        fs.writeFileSync(tmpFile, pdf);
        const res = await Promise.all([getPdf(tmpFile), getPdf(assertFile)]);
        const [a, e] = res;
        expect(a).toEqual(e);
        const hrend = process.hrtime(hrstart);
        expect(hrend[0]).toBeLessThan(5)
      });
    }
  });
});

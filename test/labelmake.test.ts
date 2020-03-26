import SauceHanSansJP from "./fonts/SauceHanSansJP";
import SauceHanSerifJP from "./fonts/SauceHanSerifJP";
const fs = require("fs");
import labelmake from "../src/labelmake";
const PDFParser = require("pdf2json");
import { TemplateData } from "../src/type";
const atena8 = require("./templates/atena8.json");

const getPdf = (pdfFilePath: string) => {
  const pdfParser = new PDFParser();
  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", reject);
    pdfParser.on("pdfParser_dataReady", resolve);
    pdfParser.loadPDF(pdfFilePath);
  });
};

const getTmpPath = (fileName: string) => __dirname + `/tmp/${fileName}`;

type Input = { test: string };
const getTemplateData = (): TemplateData<Input> => ({
  background: null,
  schema: {
    test: {
      position: { x: 10, y: 10 },
      width: 80,
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
  },
  fontName: ""
});

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
  describe("simple", () => {
    test("Default Font(Roboto)", async () => {
      const input: Input[] = [{ test: "This is Roboto" }];
      const template = getTemplateData();
      delete template.fontName;
      const pdf = await labelmake({ input, template });
      const file = getTmpPath("roboto.pdf");
      fs.writeFileSync(file, pdf);
      const res = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/roboto.pdf")
      ]);
      const [a, e] = res;
      expect(a).toEqual(e);
    });

    test("SauceHanSansJP", async () => {
      const fontName = "SauceHanSansJP";
      const input = [
        {
          test: "1234 １２３４　春夏秋冬我我輩は猫である by SauceHanSansJP"
        }
      ];
      const template = Object.assign(getTemplateData(), { fontName });
      const font = { [fontName]: SauceHanSansJP };
      const pdf = await labelmake({ input, template, font });
      const file = getTmpPath("sans.pdf");
      fs.writeFileSync(file, pdf);
      const res = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/sans.pdf")
      ]);
      const [a, e] = res;
      expect(a).toEqual(e);
    });

    test("SauceHanSerifJP", async () => {
      const fontName = "SauceHanSerifJP";
      const input = [
        {
          test: "1234 １２３４　春夏秋冬我輩は猫である by SauceHanSerifJP"
        }
      ];
      const template = Object.assign(getTemplateData(), { fontName });
      const font = { SauceHanSerifJP };
      const pdf = await labelmake({ input, template, font });
      const file = getTmpPath("serif.pdf");
      fs.writeFileSync(file, pdf);
      const res = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/serif.pdf")
      ]);
      const [a, e] = res;
      expect(a).toEqual(e);
    });

    test("SauceHanSansJP and SauceHanSerifJP", async () => {
      const fontName1 = "SauceHanSansJP";
      const fontName2 = "SauceHanSerifJP";
      type Input = { sans: string; serif: string };
      const input: Input[] = [
        {
          sans: "1234 １２３４　春夏秋冬我輩は猫である by SauceHanSansJP",
          serif: "1234 １２３４　春夏秋冬我輩は猫である by SauceHanSerifJP"
        }
      ];
      const template: TemplateData<Input> = {
        background: null,
        schema: {
          sans: {
            position: { x: 10, y: 10 },
            width: 80,
            alignment: "left",
            fontSize: 8,
            characterSpacing: 0,
            type: "text",
            lineHeight: 1
          },
          serif: {
            position: { x: 10, y: 60 },
            width: 80,
            alignment: "left",
            fontName: fontName2,
            fontSize: 8,
            characterSpacing: 0,
            type: "text",
            lineHeight: 1
          }
        },
        pageSize: {
          width: 100,
          height: 100
        },
        fontName: fontName1
      };
      const font = {
        [fontName1]: SauceHanSansJP,
        [fontName2]: SauceHanSerifJP
      };
      const pdf = await labelmake({ input, template, font });
      const file = getTmpPath("sans&serif.pdf");
      fs.writeFileSync(file, pdf);
      const ress = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/sans&serif.pdf")
      ]);
      const [a, e] = ress;
      expect(a).toEqual(e);
    });
  });

  describe("complex", () => {
    test("atena8sans", async () => {
      const pdf = await labelmake({
        input: atena8.sampledata,
        template: atena8,
        font: { SauceHanSansJP }
      });
      const file = getTmpPath("atena8sans.pdf");
      fs.writeFileSync(file, pdf);
      const ress = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/atena8sans.pdf")
      ]);
      const [a, e] = ress;
      expect(a).toEqual(e);
    });
    test("atena8serif", async () => {
      const atena8serif = JSON.parse(JSON.stringify(atena8));
      atena8serif.fontName = "SauceHanSerifJP";
      const pdf = await labelmake({
        input: atena8.sampledata,
        template: atena8serif,
        font: { SauceHanSerifJP }
      });
      const file = getTmpPath("atena8serif.pdf");
      fs.writeFileSync(file, pdf);
      const ress = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/atena8serif.pdf")
      ]);
      const [a, e] = ress;
      expect(a).toEqual(e);
    });
  });
});

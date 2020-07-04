import SauceHanSansJP from "./fonts/SauceHanSansJP";
import SauceHanSerifJP from "./fonts/SauceHanSerifJP";
const fs = require("fs");
import labelmake from "../src/labelmake";
const PDFParser = require("pdf2json");
import { TemplateData, Setting } from "../src/type";
const atena8 = require("./templates/atena8.json");
const image = require("./templates/image.json");
const svg = require("./templates/svg.json");
const barcode = require("./templates/barcode.json");

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
const getTemplateData = (): TemplateData<Input>[] => [
  {
    background: null,
    schema: {
      test: {
        position: { x: 10, y: 10 },
        width: 80,
        height: 80,
        alignment: "left",
        fontSize: 8,
        characterSpacing: 0,
        type: "text",
        lineHeight: 1,
      },
    },
  },
];

const getSetting = (): Setting => ({
  pageSize: {
    width: 100,
    height: 100,
  },
  fontName: "",
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
      const inputs: Input[] = [{ test: "This is Roboto" }];
      const templates = getTemplateData();
      const setting = getSetting();
      delete setting.fontName;
      const pdf = await labelmake({ inputs, templates, setting });
      const file = getTmpPath("roboto.pdf");
      fs.writeFileSync(file, pdf);
      const res = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/roboto.pdf"),
      ]);
      const [a, e] = res;
      expect(a).toEqual(e);
    });

    test("SauceHanSansJP", async () => {
      const fontName = "SauceHanSansJP";
      const inputs = [
        {
          test: "1234 １２３４　春夏秋冬我我輩は猫である by SauceHanSansJP",
        },
      ];
      const templates = getTemplateData();
      const setting = Object.assign(getSetting(), { fontName });
      const font = { [fontName]: SauceHanSansJP };
      const pdf = await labelmake({ inputs, templates, setting, font });
      const file = getTmpPath("sans.pdf");
      fs.writeFileSync(file, pdf);
      const res = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/sans.pdf"),
      ]);
      const [a, e] = res;
      expect(a).toEqual(e);
    });

    test("SauceHanSerifJP", async () => {
      const fontName = "SauceHanSerifJP";
      const inputs = [
        {
          test: "1234 １２３４　春夏秋冬我輩は猫である by SauceHanSerifJP",
        },
      ];
      const templates = getTemplateData();
      const setting = Object.assign(getSetting(), { fontName });
      const font = { SauceHanSerifJP };
      const pdf = await labelmake({ inputs, templates, setting, font });
      const file = getTmpPath("serif.pdf");
      fs.writeFileSync(file, pdf);
      const res = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/serif.pdf"),
      ]);
      const [a, e] = res;
      expect(a).toEqual(e);
    });

    test("SauceHanSansJP and SauceHanSerifJP", async () => {
      const fontName1 = "SauceHanSansJP";
      const fontName2 = "SauceHanSerifJP";
      type Input = { sans: string; serif: string };
      const inputs: Input[] = [
        {
          sans: "1234 １２３４　春夏秋冬我輩は猫である by SauceHanSansJP",
          serif: "1234 １２３４　春夏秋冬我輩は猫である by SauceHanSerifJP",
        },
      ];
      const templates: TemplateData<Input>[] = [
        {
          background: null,
          schema: {
            sans: {
              position: { x: 10, y: 10 },
              width: 80,
              height: 80,

              alignment: "left",
              fontSize: 8,
              characterSpacing: 0,
              type: "text",
              lineHeight: 1,
            },
            serif: {
              position: { x: 10, y: 60 },
              width: 80,
              height: 80,
              alignment: "left",
              fontName: fontName2,
              fontSize: 8,
              characterSpacing: 0,
              type: "text",
              lineHeight: 1,
            },
          },
        },
      ];
      const setting = Object.assign(getSetting(), { fontName: fontName1 });
      const font = {
        [fontName1]: SauceHanSansJP,
        [fontName2]: SauceHanSerifJP,
      };
      const pdf = await labelmake({ inputs, templates, setting, font });
      const file = getTmpPath("sans&serif.pdf");
      fs.writeFileSync(file, pdf);
      const ress = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/sans&serif.pdf"),
      ]);
      const [a, e] = ress;
      expect(a).toEqual(e);
    });
  });

  describe("complex text", () => {
    test("atena8sans", async () => {
      const pdf = await labelmake({
        inputs: atena8.inputs,
        templates: atena8.templates,
        setting: atena8.setting,
        font: { SauceHanSansJP },
      });
      const file = getTmpPath("atena8sans.pdf");
      fs.writeFileSync(file, pdf);
      const ress = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/atena8sans.pdf"),
      ]);
      const [a, e] = ress;
      expect(a).toEqual(e);
    });
    test("atena8serif", async () => {
      const atena8serif = JSON.parse(JSON.stringify(atena8));
      atena8serif.setting.fontName = "SauceHanSerifJP";
      const pdf = await labelmake({
        inputs: atena8serif.inputs,
        templates: atena8serif.templates,
        setting: atena8serif.setting,
        font: { SauceHanSerifJP },
      });
      const file = getTmpPath("atena8serif.pdf");
      fs.writeFileSync(file, pdf);
      const ress = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/atena8serif.pdf"),
      ]);
      const [a, e] = ress;
      expect(a).toEqual(e);
    });
  });
  describe("complex image", () => {
    test("image", async () => {
      const pdf = await labelmake({
        inputs: image.inputs,
        templates: image.templates,
        setting: image.setting,
        font: { SauceHanSansJP },
      });
      const file = getTmpPath("image.pdf");
      fs.writeFileSync(file, pdf);
      const ress = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/image.pdf"),
      ]);
      const [a, e] = ress;
      expect(a).toEqual(e);
    });
  });
  describe("complex svg", () => {
    test("svg", async () => {
      const pdf = await labelmake({
        inputs: svg.inputs,
        templates: svg.templates,
        setting: svg.setting,
        font: { SauceHanSansJP },
      });
      const file = getTmpPath("svg.pdf");
      fs.writeFileSync(file, pdf);
      const ress = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/svg.pdf"),
      ]);
      const [a, e] = ress;
      expect(a).toEqual(e);
    });
  });
  describe("complex barcode", () => {
    test("barcode", async () => {
      const pdf = await labelmake({
        inputs: barcode.inputs,
        templates: barcode.templates,
        setting: barcode.setting,
        font: { SauceHanSansJP },
      });
      const file = getTmpPath("barcode.pdf");
      fs.writeFileSync(file, pdf);
      const ress = await Promise.all([
        getPdf(file),
        getPdf(__dirname + "/assert/barcode.pdf"),
      ]);
      const [a, e] = ress;
      expect(a).toEqual(e);
    });
  });
});

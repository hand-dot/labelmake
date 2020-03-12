import { sans_vfs_fonts } from "./fonts/sans_vfs_fonts";
import { serif_vfs_fonts } from "./fonts/serif_vfs_fonts";
const fs = require("fs");
import labelmake from "../src/labelmake";
const PDFParser = require("pdf2json");
import { TemplateData } from "../src/type";

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
  position: {
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

  test("NotoSansCJKjp", async () => {
    const fontName = "NotoSansCJKjp";
    const input = [
      {
        test: "1234 １２３４　我輩は猫である by NotoSansCJKjp"
      }
    ];
    const template = Object.assign(getTemplateData(), { fontName });
    const font = { [fontName]: sans_vfs_fonts };
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

  test("NotoSerifCJKjp", async () => {
    const fontName = "NotoSerifCJKjp";
    const input = [
      {
        test:
          "1234 １２３４　春夏秋冬我輩は猫である by NotoSerifCJKjp"
      }
    ];
    const template = Object.assign(getTemplateData(), { fontName });
    const font = { [fontName]: serif_vfs_fonts };
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

  test("NotoSansCJKjp and NotoSerifCJKjp", async () => {
    const fontName1 = "NotoSansCJKjp";
    const fontName2 = "NotoSerifCJKjp";
    type Input = { sans: string; serif: string };
    const input: Input[] = [
      {
        sans:
          "1234 １２３４　春夏秋冬我輩は猫である by NotoSansCJKjp",
        serif:
          "1234 １２３４　春夏秋冬我輩は猫である by NotoSerifCJKjp"
      }
    ];
    const template: TemplateData<Input> = {
      background: null,
      position: {
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
    const font = { [fontName1]: sans_vfs_fonts, [fontName2]: serif_vfs_fonts };
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

  // TODO 複雑なパターンのテストが必要labelmake.jpで使っているテンプレートをそのままテストにする
});

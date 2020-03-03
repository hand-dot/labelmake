//@ts-ignore
import { sans_vfs_fonts } from "./fonts/sans_vfs_fonts";
//@ts-ignore
import { serif_vfs_fonts } from "./fonts/serif_vfs_fonts";
import fs from "fs";
import Labelmake from "../src/index";
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

const getTemplateData = (): TemplateData => ({
  background: null,
  position: {
    test: {
      position: { x: 10, y: 10 },
      width: 20,
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

describe("Labelmake integrate test", () => {
  afterAll(() => {
    const dir = __dirname + "/tmp";
    fs.readdir(dir, (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach(file => {
        if (file !== ".gitkeep") {
          fs.unlink(`${dir}/${file}`, err => {
            if (err) {
              throw err;
            }
          });
        }
      });
    });
  });

  test("NotoSansCJKjp", async () => {
    const fontName = "NotoSansCJKjp";
    const labelmake = new Labelmake();
    labelmake.registerFont("NotoSansCJKjp", sans_vfs_fonts);
    const pdf = await labelmake.create(
      Object.assign(getTemplateData(), { fontName }),
      [{ test: "hello" }]
    );
    const file = getTmpPath("sans.pdf");
    fs.writeFileSync(file, pdf);
    const ress = await Promise.all([
      getPdf(file),
      getPdf(__dirname + "/assert/sans.pdf")
    ]);
    const [a, e] = ress;
    expect(a).toEqual(e);
  });

  test("NotoSerifCJKjp", async () => {
    const fontName = "NotoSerifCJKjp";
    const labelmake = new Labelmake();
    labelmake.registerFont("NotoSerifCJKjp", serif_vfs_fonts);
    const pdf = await labelmake.create(
      Object.assign(getTemplateData(), { fontName }),
      [{ test: "hello" }]
    );
    const file = getTmpPath("serif.pdf");
    fs.writeFileSync(file, pdf);
    const ress = await Promise.all([
      getPdf(file),
      getPdf(__dirname + "/assert/serif.pdf")
    ]);
    const [a, e] = ress;
    expect(a).toEqual(e);
  });
});

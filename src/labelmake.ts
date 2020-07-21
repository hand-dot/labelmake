import {
  PDFFont,
  PDFDocument,
  rgb,
  degrees,
  setCharacterSpacing,
} from "pdf-lib";
const fontkit = require('@pdf-lib/fontkit');
import { createBarCode } from "./barcode";
import { Template } from "./type";

const hex2rgb = (hex: string) => {
  if (hex.slice(0, 1) == "#") hex = hex.slice(1);
  if (hex.length == 3)
    hex =
      hex.slice(0, 1) +
      hex.slice(0, 1) +
      hex.slice(1, 2) +
      hex.slice(1, 2) +
      hex.slice(2, 3) +
      hex.slice(2, 3);

  return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((str) =>
    parseInt(str, 16)
  );
};

const mm2pt = (mm: number): number => {
  // https://www.ddc.co.jp/words/archives/20090701114500.html
  const ptRatio = 2.8346;
  return parseFloat(String(mm)) * ptRatio;
};

const calcX = (
  x: number,
  alignment: "left" | "right" | "center",
  boxWidth: number,
  textWidth: number
) => {
  let addition = 0;
  if (alignment === "center") {
    addition = (boxWidth - textWidth) / 2;
  } else if (alignment === "right") {
    addition = boxWidth - textWidth;
  }
  return mm2pt(x) + addition;
};

const calcY = (y: number, height: number, fontSize: number) =>
  // FIXME 1.2ってなんでだっけ？
  height - mm2pt(y) - fontSize * 1.2;

// FIXME 画像は同一のものを使い回すことで高速化できる
const labelmake = async ({
  inputs,
  template,
  font,
}: {
  inputs: { [key: string]: string }[];
  template: Template;
  font: { [key: string]: string | Uint8Array | ArrayBuffer };
}) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontValues = await Promise.all(
    Object.values(font).map((v) => pdfDoc.embedFont(v, { subset: true }))
  );
  const fontObj = Object.keys(font).reduce(
    (acc, cur, i) => Object.assign(acc, { [cur]: fontValues[i] }),
    {} as { [key: string]: PDFFont }
  );

  const basePdf = await PDFDocument.load(template.basePdf);
  const embeddedPages = await pdfDoc.embedPdf(
    basePdf,
    basePdf.getPageIndices()
  );
  for (let i = 0; i < inputs.length; i++) {
    const inputObj = inputs[i];
    const keys = Object.keys(inputObj);
    for (let j = 0; j < embeddedPages.length; j++) {
      const embeddedPage = embeddedPages[j];
      const page = pdfDoc.addPage([embeddedPage.width, embeddedPage.height]);
      page.drawPage(embeddedPage);
      if (!template.schemas[j]) continue;
      for (let l = 0; l < keys.length; l++) {
        const key = keys[l];
        if (!template.schemas[j][key]) continue;
        const schema = template.schemas[j][key];
        const input = inputObj[key];
        if (!input) return;
        const rotate = degrees(schema.rotate ? schema.rotate : 0);
        const boxWidth = mm2pt(schema.width);
        const boxHeight = mm2pt(schema.height);
        if (schema.type === "text") {
          const myFont =
            fontObj[schema.fontName ? schema.fontName : template.fontName];
          const [r, g, b] = hex2rgb(
            schema.fontColor ? schema.fontColor : "#000"
          );
          const fontSize = schema.fontSize ? schema.fontSize : 13;
          const alignment = schema.alignment ? schema.alignment : "left";
          const lineHeight = schema.lineHeight ? schema.lineHeight : 1;
          const characterSpacing = schema.characterSpacing
            ? schema.characterSpacing
            : 0;
          const textHeight = myFont.heightAtSize(fontSize);
          let beforeLineOver = 0;
          input.split(/\r|\n|\r\n/g).forEach((inputLine, index) => {
            const textWidth = myFont.widthOfTextAtSize(inputLine, fontSize);
            page.pushOperators(setCharacterSpacing(characterSpacing));
            page.drawText(inputLine, {
              x: calcX(schema.position.x, alignment, boxWidth, textWidth),
              y:
                calcY(schema.position.y, embeddedPage.height, fontSize) -
                (lineHeight * textHeight * index +
                  lineHeight * textHeight * beforeLineOver),
              rotate: rotate,
              size: fontSize,
              maxWidth: boxWidth,
              font: myFont,
              lineHeight: lineHeight * textHeight,
              color: rgb(r, g, b),
              wordBreaks: [""],
            });
            for (let cnt = 1; textWidth - boxWidth * cnt > 0; cnt++) {
              beforeLineOver += 1;
            }
          });
        } else if (schema.type === "image") {
          const isPng = input.startsWith("data:image/png;");
          pdfDoc[isPng ? "embedPng" : "embedJpg"](input).then((image) => {
            page.drawImage(image, {
              x: calcX(schema.position.x, "left", boxWidth, boxWidth),
              y: calcY(schema.position.y, embeddedPage.height, boxHeight),
              rotate: rotate,
              width: boxWidth,
              height: boxHeight,
            });
          });
        } else if (
          schema.type === "qrcode" ||
          schema.type === "ean13" ||
          schema.type === "ean8" ||
          schema.type === "japanpost" ||
          schema.type === "code39" ||
          schema.type === "code128" ||
          schema.type === "nw7" ||
          schema.type === "itf14"
        ) {
          const imageBuf = await createBarCode({
            type: schema.type,
            width: schema.width,
            height: schema.height,
            input,
          });
          if (imageBuf) {
            pdfDoc.embedPng(imageBuf).then((image) => {
              page.drawImage(image, {
                x: calcX(schema.position.x, "left", boxWidth, boxWidth),
                y: calcY(schema.position.y, embeddedPage.height, boxHeight),
                rotate: rotate,
                width: boxWidth,
                height: boxHeight,
              });
            });
          }
        }
      }
    }
  }
  return await pdfDoc.save();
};

export default labelmake;

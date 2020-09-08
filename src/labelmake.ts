import {
  PDFFont,
  PDFImage,
  PDFDocument,
  PDFEmbeddedPage,
  rgb,
  degrees,
  setCharacterSpacing,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { createBarCode } from "./barcode";
import { Template, isPageSize } from "./type";

const barcodes = [
  "qrcode",
  "ean13",
  "ean8",
  "japanpost",
  "code39",
  "code128",
  "nw7",
  "itf14",
];

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

const calcY = (y: number, height: number, itemHeight: number) =>
  height - mm2pt(y) - itemHeight;

const labelmake = async ({
  inputs,
  template,
  font,
}: {
  inputs: { [key: string]: string }[];
  template: Template;
  font: { [key: string]: string | Uint8Array | ArrayBuffer };
}) => {
  const { basePdf, schemas } = template;
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontValues = await Promise.all(
    Object.values(font).map((v) => pdfDoc.embedFont(v, { subset: true }))
  );
  const fontObj = Object.keys(font).reduce(
    (acc, cur, i) => Object.assign(acc, { [cur]: fontValues[i] }),
    {} as { [key: string]: PDFFont }
  );
  const inputImageCache: { [key: string]: PDFImage } = {};
  const isBlank = isPageSize(basePdf);
  let embeddedPages: PDFEmbeddedPage[] = [];
  if (!isPageSize(basePdf)) {
    const embedPdf = await PDFDocument.load(basePdf);
    embeddedPages = await pdfDoc.embedPdf(embedPdf, embedPdf.getPageIndices());
  }
  for (let i = 0; i < inputs.length; i++) {
    const inputObj = inputs[i];
    const keys = Object.keys(inputObj);
    for (let j = 0; j < (isBlank ? schemas : embeddedPages).length; j++) {
      const pageWidth = isPageSize(basePdf)
        ? mm2pt(basePdf.width)
        : embeddedPages[j].width;
      const pageHeight = isPageSize(basePdf)
        ? mm2pt(basePdf.height)
        : embeddedPages[j].height;
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      if (!isBlank) page.drawPage(embeddedPages[j]);
      if (!schemas[j]) continue;
      for (let l = 0; l < keys.length; l++) {
        const key = keys[l];
        const schema = schemas[j][key];
        const input = inputObj[key];
        if (!schema || !input) continue;
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
          page.pushOperators(setCharacterSpacing(characterSpacing));

          let beforeLineOver = 0;
          input.split(/\r|\n|\r\n/g).forEach((inputLine, index) => {
            const textWidth = myFont.widthOfTextAtSize(inputLine, fontSize);
            page.drawText(inputLine, {
              x: calcX(schema.position.x, alignment, boxWidth, textWidth),
              y:
                calcY(schema.position.y, pageHeight, fontSize) -
                lineHeight * fontSize * (index + beforeLineOver) -
                (lineHeight === 0 ? 0 : ((lineHeight - 1) * fontSize) / 2),
              rotate: rotate,
              size: fontSize,
              lineHeight: lineHeight * fontSize,
              maxWidth: boxWidth,
              font: myFont,
              color: rgb(r, g, b),
              wordBreaks: [""],
            });
            for (let cnt = 1; textWidth - boxWidth * cnt > 0; cnt++) {
              beforeLineOver += 1;
            }
          });
        } else if (barcodes.includes(schema.type) || schema.type === "image") {
          const opt = {
            x: calcX(schema.position.x, "left", boxWidth, boxWidth),
            y: calcY(schema.position.y, pageHeight, boxHeight),
            rotate: rotate,
            width: boxWidth,
            height: boxHeight,
          };
          const inputImageCacheKey = `${schema.type}${input}`;
          let image = inputImageCache[inputImageCacheKey];
          if (!image && schema.type === "image") {
            const isPng = input.startsWith("data:image/png;");
            image = await pdfDoc[isPng ? "embedPng" : "embedJpg"](input);
          } else if (!image && schema.type !== "image") {
            const imageBuf = await createBarCode({
              type: schema.type,
              width: schema.width,
              height: schema.height,
              input,
            });
            if (imageBuf) {
              image = await pdfDoc.embedPng(imageBuf);
            }
          }
          if (image) {
            inputImageCache[inputImageCacheKey] = image;
            page.drawImage(image, opt);
          }
        }
      }
    }
  }
  return await pdfDoc.save();
};

export default labelmake;

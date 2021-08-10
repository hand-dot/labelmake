import {
  PDFFont,
  PDFImage,
  PDFDocument,
  PDFEmbeddedPage,
  rgb,
  degrees,
  setCharacterSpacing,
  StandardFonts,
  TransformationMatrix,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { createBarCode } from "./barcode";
import { uniq, hex2rgb, mm2pt, calcX, calcY, getSplittedLines } from "./util"
import { Args, isPageSize, isSubsetFont } from "./type";
import { barcodes } from "./constants"



const labelmake = async ({ inputs, template, font, splitThreshold = 3 }: Args) => {
  if (inputs.length < 1) {
    throw Error("inputs should be more than one length");
  }

  const fontNamesInSchemas = uniq(
    template.schemas
      .map((s) => Object.values(s).map((v) => v.fontName))
      .reduce((acc, val) => acc.concat(val), [] as (string | undefined)[])
      .filter(Boolean) as string[]
  );

  if (font) {
    const fontNames = Object.keys(font);
    if (template.fontName && !fontNames.includes(template.fontName)) {
      throw Error(
        `${template.fontName} of template.fontName is not found in font`
      );
    }
    if (fontNamesInSchemas.some((f) => !fontNames.includes(f))) {
      throw Error(
        `${fontNamesInSchemas
          .filter((f) => !fontNames.includes(f))
          .join()} of template.schemas is not found in font`
      );
    }
  }

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const isUseMyfont =
    font && (template.fontName || fontNamesInSchemas.length > 0);
  const fontValues = isUseMyfont
    ? await Promise.all(
      Object.values(font!).map((v) =>
        pdfDoc.embedFont(isSubsetFont(v) ? v.data : v, {
          subset: isSubsetFont(v) ? v.subset : true,
        })
      )
    )
    : [];
  const fontObj = isUseMyfont
    ? Object.keys(font!).reduce(
      (acc, cur, i) => Object.assign(acc, { [cur]: fontValues[i] }),
      {} as { [key: string]: PDFFont }
    )
    : {
      [StandardFonts.Helvetica]: await pdfDoc.embedFont(
        StandardFonts.Helvetica
      ),
    };

  const inputImageCache: { [key: string]: PDFImage } = {};
  const { basePdf, schemas } = template;
  const isBlank = isPageSize(basePdf);
  let embeddedPages: PDFEmbeddedPage[] = [];
  let embedPdfBoxes: {
    mediaBox: { x: number; y: number; width: number; height: number };
    bleedBox: { x: number; y: number; width: number; height: number };
    trimBox: { x: number; y: number; width: number; height: number };
  }[] = [];
  if (!isPageSize(basePdf)) {
    const embedPdf = await PDFDocument.load(basePdf);
    const embedPdfPages = embedPdf.getPages();
    embedPdfBoxes = embedPdfPages.map((p) => {
      const mediaBox = p.getMediaBox();
      const bleedBox = p.getBleedBox();
      const trimBox = p.getTrimBox();
      return { mediaBox, bleedBox, trimBox };
    });
    const boundingBoxes = embedPdfPages.map((p) => {
      const { x, y, width, height } = p.getMediaBox();
      return { left: x, bottom: y, right: width, top: height + y };
    });
    const transformationMatrices = embedPdfPages.map(
      () => [1, 0, 0, 1, 0, 0] as TransformationMatrix
    );

    embeddedPages = await pdfDoc.embedPages(
      embedPdfPages,
      boundingBoxes,
      transformationMatrices
    );
  }
  for (let i = 0; i < inputs.length; i++) {
    const inputObj = inputs[i];
    const keys = Object.keys(inputObj);
    for (let j = 0; j < (isBlank ? schemas : embeddedPages).length; j++) {
      const embeddedPage = embeddedPages[j];
      const pageWidth = isPageSize(basePdf)
        ? mm2pt(basePdf.width)
        : embeddedPage.width;
      const pageHeight = isPageSize(basePdf)
        ? mm2pt(basePdf.height)
        : embeddedPage.height;
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      if (!isBlank) {
        page.drawPage(embeddedPage);
        const { mediaBox: mb, bleedBox: bb, trimBox: tb } = embedPdfBoxes[j];
        page.setMediaBox(mb.x, mb.y, mb.width, mb.height);
        page.setBleedBox(bb.x, bb.y, bb.width, bb.height);
        page.setTrimBox(tb.x, tb.y, tb.width, tb.height);
      }
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
          if (schema.backgroundColor) {
            const [br, bg, bb] = hex2rgb(schema.backgroundColor);
            page.drawRectangle({
              x: calcX(schema.position.x, "left", boxWidth, boxWidth),
              y: calcY(schema.position.y, pageHeight, boxHeight),
              width: boxWidth,
              height: boxHeight,
              color: rgb(br / 255, bg / 255, bb / 255),
            });
          }

          const fontValue = isUseMyfont
            ? fontObj[schema.fontName ? schema.fontName : template.fontName!]
            : fontObj[StandardFonts.Helvetica];
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
            const isOverEval = (testString: string) => {
              const testStringWidth = fontValue.widthOfTextAtSize(testString, fontSize) + ((testString.length - 1) * characterSpacing)
              /**
               * split if the difference is less then two pixel
               * (found out / tested this threshold heuristically, most probably widthOfTextAtSize is unprecise)
               */
              return boxWidth - testStringWidth <= splitThreshold;
            }
            const splitedLine = getSplittedLines(inputLine, isOverEval);
            splitedLine.forEach((inputLine2, index2) => {
              const textWidth = fontValue.widthOfTextAtSize(
                inputLine2,
                fontSize
              ) + ((inputLine2.length - 1) * characterSpacing);
              page.drawText(inputLine2, {
                x: calcX(schema.position.x, alignment, boxWidth, textWidth),
                y:
                  calcY(schema.position.y, pageHeight, fontSize) -
                  lineHeight * fontSize * (index + index2 + beforeLineOver) -
                  (lineHeight === 0 ? 0 : ((lineHeight - 1) * fontSize) / 2),
                rotate: rotate,
                size: fontSize,
                lineHeight: lineHeight * fontSize,
                maxWidth: boxWidth,
                font: fontValue,
                color: rgb(r / 255, g / 255, b / 255),
                wordBreaks: [""],
              });
              if (splitedLine.length === index2 + 1) beforeLineOver += index2;
            });
          });
        } else if (schema.type === "image" || barcodes.includes(schema.type)) {
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

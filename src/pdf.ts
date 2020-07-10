import { Template, TemplateSchema, Content, DocDefinition } from "./type";
import {
  base64PngHeader,
  base64JpegHeader,
  dummyImage,
  dummySvg,
} from "./constants";
import { createBarCode } from "./barcode";

const mm2pt = (mm: number): number => {
  // https://www.ddc.co.jp/words/archives/20090701114500.html
  const pointRatio = 2.8346;
  return parseFloat(String(mm)) * pointRatio;
};

const validateBase64Image = (base64: string) =>
  base64 !== "" &&
  [base64PngHeader, base64JpegHeader].some((h) => base64.startsWith(h));

const validateSvg = (svg: string) =>
  svg.replace(/\r?\n/g, "").endsWith("</svg>");

const createImage = (base64Image: string | null) =>
  base64Image && validateBase64Image(base64Image) ? base64Image : dummyImage;

const createSvg = (svg: string | null) =>
  svg && validateSvg(svg) ? svg : dummySvg;

export const createDocDefinition = async (
  inputs: {
    [key: string]: string | null;
  }[],
  template: Template
): Promise<DocDefinition> => {
  const docDefinition: DocDefinition = {
    pageSize: {
      width: mm2pt(template.pageSize.width),
      height: mm2pt(template.pageSize.height),
    },
    pageMargins: [0, 0, 0, -mm2pt(20)],
    defaultStyle: { font: template.fontName },
    content: [],
  };
  for (let i = 0; i < inputs.length; i++) {
    for (let l = 0; l < template.datas.length; l++) {
      const { background, schema } = template.datas[l];
      const inputObj = inputs[i];
      const bg: Content = {
        image: createImage(background),
        absolutePosition: { x: 0, y: 0 },
        width: mm2pt(template.pageSize.width),
        pageBreak: i === 0 && l === 0 ? "" : "before",
      };
      if (background && validateSvg(background)) {
        bg.svg = createSvg(background);
        delete bg.image;
      }
      docDefinition.content.push(bg);
      const keys = Object.keys(schema);
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const labelData: TemplateSchema = schema[key];
        const obj: Content = {
          absolutePosition: {
            x: mm2pt(labelData.position.x),
            y: mm2pt(labelData.position.y),
          },
        };
        const input = inputObj[key] ? inputObj[key] : "";
        if (labelData.type === "text") {
          obj.alignment = labelData.alignment;
          obj.columns = [
            {
              text: input || "",
              width: mm2pt(labelData.width),
              font: labelData.fontName,
              color: labelData.fontColor,
              fontSize: labelData.fontSize,
              characterSpacing: labelData.characterSpacing,
              lineHeight: labelData.lineHeight,
            },
          ];
        } else if (labelData.type === "image") {
          obj.image = createImage(input);
          obj.width = mm2pt(labelData.width);
          obj.height = mm2pt(labelData.height);
        } else if (labelData.type === "svg") {
          obj.svg = createSvg(input);
          obj.width = mm2pt(labelData.width);
          obj.height = mm2pt(labelData.height);
        } else if (
          labelData.type === "qrcode" ||
          labelData.type === "ean13" ||
          labelData.type === "ean8" ||
          labelData.type === "japanpost" ||
          labelData.type === "code39" ||
          labelData.type === "code128" ||
          labelData.type === "nw7" ||
          labelData.type === "itf14"
        ) {
          obj.image = await createBarCode({
            type: labelData.type,
            width: labelData.width,
            height: labelData.height,
            input,
          });
          obj.width = mm2pt(labelData.width);
          obj.height = mm2pt(labelData.height);
        }
        docDefinition.content.push(obj);
      }
    }
  }
  return docDefinition;
};

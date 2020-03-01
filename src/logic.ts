//@ts-ignore
import * as bwipjs from "bwip-js/dist/node-bwipjs.js";
//@ts-ignore
import * as pdfMake from "pdfmake/build/pdfmake";
import {
  TemplateData,
  TemplatePosition,
  BarCodeType,
  Content,
  DocDefinition
} from "./type";

const base64PngHeader = "data:image/png;base64,";
const base64JpegHeader = "data:image/jpeg;base64,";
const dummyImage =
  base64PngHeader +
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";

const mm2pt = (mm: number): number => {
  // https://www.ddc.co.jp/words/archives/20090701114500.html
  const pointRatio = 2.8346;
  return parseFloat(String(mm)) * pointRatio;
};

const pngBuffer2PngBase64 = (buffer: Buffer) =>
  typeof window === "undefined"
    ? buffer.toString("base64")
    : base64PngHeader + btoa(String.fromCharCode(...new Uint8Array(buffer)));

const validateBase64Image = (base64: string) =>
  base64 !== "" &&
  [base64PngHeader, base64JpegHeader].some(h => base64.startsWith(h));

export const validateBarcodeInput = (type: BarCodeType, input: string) => {
  if (!input) return false;
  if (type === "qrcode") {
    // 漢字を含まない500文字以下
    const regexp = /([\u{3005}\u{3007}\u{303b}\u{3400}-\u{9FFF}\u{F900}-\u{FAFF}\u{20000}-\u{2FFFF}][\u{E0100}-\u{E01EF}\u{FE00}-\u{FE02}]?)/mu;
    return !regexp.test(input) && input.length < 500;
  } else if (type === "japanpost") {
    // 郵便番号は数字(0-9)のみ、住所表示番号は英数字(0-9,A-Z)とハイフン(-)が使用可能です。
    const regexp = /^(\d{7})(\d|[A-Z]|-)+$/;
    return regexp.test(input);
  } else if (type === "ean13") {
    // 有効文字は数値(0-9)のみ。標準タイプはチェックデジットを含まない12桁
    const regexp = /^\d{12}$/;
    return regexp.test(input);
  } else if (type === "ean8") {
    // 有効文字は数値(0-9)のみ。短縮タイプはチェックデジットを含まない7桁
    const regexp = /^\d{7}$/;
    return regexp.test(input);
  } else if (type === "code39") {
    // CODE39は数字(0-9)、アルファベット大文字(A-Z)、記号(-.$/+%)、半角スペースに対応しています。
    const regexp = /^(\d|[A-Z]|\-|\.|\$|\/|\+|\%|\s)+$/;
    return regexp.test(input);
  } else if (type === "code128") {
    // （漢字、ひらがな、カタカナ以外）可能
    // https://qiita.com/graminume/items/2ac8dd9c32277fa9da64
    return input.match(
      /([\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]|[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝〜])+/
    )
      ? false
      : true;
  } else if (type === "nw7") {
    // NW-7は数字(0-9)と記号(-.$:/+)に対応しています。
    // スタートコード／ストップコードとして、コードの始まりと終わりはアルファベット(A-D)のいずれかを使用してください。
    const regexp = /^[A-Da-d]([0-9\-\.\$\:\/\+])+[A-Da-d]$/;
    return regexp.test(input);
  } else if (type === "itf14") {
    // 有効文字は数値(0-9)のみ。 チェックデジットを含まない13桁です。
    const regexp = /^\d{13}$/;
    return regexp.test(input);
  }
  return false;
};

const createBarCode = async ({
  type,
  input,
  width,
  height
}: {
  type: BarCodeType;
  input: string | null;
  width: number;
  height: number;
}) => {
  if (input && validateBarcodeInput(type, input)) {
    //@ts-ignore
    const buffer = await bwipjs.toBuffer({
      bcid: type === "nw7" ? "rationalizedCodabar" : type,
      text: input,
      width: width * 3, // BWIPPは72dpiで画像を作成するため印刷用に画像を大きくしておく
      height: height * 3
    });
    return pngBuffer2PngBase64(buffer);
  } else {
    return dummyImage;
  }
};

const createImage = (base64Image: string | null) => {
  if (base64Image && validateBase64Image(base64Image)) {
    return base64Image;
  } else {
    return dummyImage;
  }
};

export const createDocDefinition = async (
  labelDatas: {
    [key: string]: string | null;
  }[],
  templateData: TemplateData,
  preview = false
): Promise<DocDefinition> => {
  const { image, position, pageSize, fontName } = templateData;
  const docDefinition: DocDefinition = {
    pageSize: {
      width: mm2pt(pageSize.width),
      height: mm2pt(pageSize.height)
    },
    pageMargins: [0, 0, 0, -mm2pt(20)],
    defaultStyle: { font: fontName },
    content: []
  };
  for (let i = 0; i < labelDatas.length; i++) {
    const data = labelDatas[i];
    const index = i;
    docDefinition.content.push({
      image: createImage(image),
      absolutePosition: { x: 0, y: 0 },
      width: mm2pt(pageSize.width),
      pageBreak: index === 0 ? "" : "before"
    });
    if (preview) {
      docDefinition.content.push({
        absolutePosition: {
          x: mm2pt(0),
          y: mm2pt(pageSize.height / 2 - 25)
        },
        alignment: "center",
        columns: [
          {
            text: "P r e v i e w",
            color: "#999",
            width: mm2pt(pageSize.width),
            fontSize: 50
          }
        ]
      });
    }
    const keys = Object.keys(position);
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      const labelData: TemplatePosition = position[key];
      const obj: Content = {
        absolutePosition: {
          x: mm2pt(labelData.position.x),
          y: mm2pt(labelData.position.y)
        }
      };
      const input = data[key] ? data[key] : "";
      if (labelData.type === "text") {
        obj.alignment = labelData.alignment;
        obj.columns = [
          {
            text: input || "",
            width: mm2pt(labelData.width),
            fontSize: labelData.size,
            characterSpacing: labelData.space,
            lineHeight: labelData.lineHeight
          }
        ];
      } else if (labelData.type === "image") {
        obj.image = createImage(input);
        obj.width = mm2pt(labelData.width);
      } else if (labelData.type === "qrcode") {
        // バーコードの縦横比に応じて分けている
        obj.image = await createBarCode({
          type: "qrcode",
          width: labelData.width,
          height: labelData.width,
          input
        });
        obj.width = mm2pt(labelData.width);
      } else if (labelData.type === "japanpost") {
        obj.image = await createBarCode({
          type: "japanpost",
          width: labelData.width,
          height: labelData.width / 5,
          input
        });
        obj.width = mm2pt(labelData.width);
      } else if (labelData.type === "ean13" || labelData.type === "ean8") {
        obj.image = await createBarCode({
          type: labelData.type,
          width: labelData.width,
          height: labelData.width / 2,
          input
        });
        obj.width = mm2pt(labelData.width);
      } else if (
        labelData.type === "code39" ||
        labelData.type === "code128" ||
        labelData.type === "nw7" ||
        labelData.type === "itf14"
      ) {
        obj.image = await createBarCode({
          type: labelData.type,
          width: labelData.width,
          height: labelData.width / 3,
          input
        });
        obj.width = mm2pt(labelData.width);
      }
      docDefinition.content.push(obj);
    }
  }
  return docDefinition;
};

const atob = (str: string) => {
  return Buffer.from(str, "base64").toString("binary");
};

const toBlob = (base64: string) => {
  const bin = atob(base64.split(",")[1]);
  const arraybuffer = new Uint8Array(bin.length);
  for (let i = 0, l = bin.length; l > i; i++) {
    arraybuffer[i] = bin.charCodeAt(i);
  }
  return Buffer.from(arraybuffer);
};

export const createPdfBinary = (
  docDefinition: DocDefinition
): Promise<Buffer> => {
  return new Promise(resolve => {
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.getDataUrl((base64: string) => resolve(toBlob(base64)));
  });
};

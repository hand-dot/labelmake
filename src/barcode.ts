import { ToBufferOptions } from "bwip-js";
import bwipjsNode from "bwip-js/dist/node-bwipjs";
import bwipjsBrowser from "bwip-js/dist/bwip-js";
import { BarCodeType } from "./type";
import { b64toUint8Array } from "./util";

// GTIN-13, GTIN-8, GTIN-12, GTIN-14
const validateCheckDigit = (input: string, checkDigitPos: number) => {
  let passCheckDigit = true;

  if (input.length === checkDigitPos) {
    const ds = input.slice(0, -1).replace(/[^0-9]/g, "");
    let sum = 0;
    let odd = 1;
    for (let i = ds.length - 1; i > -1; i -= 1) {
      sum += Number(ds[i]) * (odd ? 3 : 1);
      odd ^= 1;
      if (sum > 0xffffffffffff) {
        // ~2^48 at max
        sum %= 10;
      }
    }
    passCheckDigit = String(10 - (sum % 10)).slice(-1) === input.slice(-1);
  }

  return passCheckDigit;
};

export const validateBarcodeInput = (type: BarCodeType, input: string) => {
  if (!input) return false;
  if (type === "qrcode") {
    // 500文字以下
    return input.length < 500;
  } else if (type === "japanpost") {
    // 郵便番号は数字(0-9)のみ。住所表示番号は英数字(0-9,A-Z)とハイフン(-)が使用可能です。
    const regexp = /^(\d{7})(\d|[A-Z]|-)+$/;
    return regexp.test(input);
  } else if (type === "ean13") {
    // 有効文字は数値(0-9)のみ。チェックデジットを含まない12桁orチェックデジットを含む13桁。
    const regexp = /^\d{12}$|^\d{13}$/;
    return regexp.test(input) && validateCheckDigit(input, 13);
  } else if (type === "ean8") {
    // 有効文字は数値(0-9)のみ。チェックデジットを含まない7桁orチェックデジットを含む8桁。
    const regexp = /^\d{7}$|^\d{8}$/;
    return regexp.test(input) && validateCheckDigit(input, 8);
  } else if (type === "code39") {
    // 有効文字は数字(0-9)。アルファベット大文字(A-Z)、記号(-.$/+%)、半角スペース。
    const regexp = /^(\d|[A-Z]|\-|\.|\$|\/|\+|\%|\s)+$/;
    return regexp.test(input);
  } else if (type === "code128") {
    // 有効文字は漢字、ひらがな、カタカナ以外。
    // https://qiita.com/graminume/items/2ac8dd9c32277fa9da64
    return input.match(
      /([\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]|[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝〜])+/
    )
      ? false
      : true;
  } else if (type === "nw7") {
    // 有効文字はNW-7は数字(0-9)と記号(-.$:/+)。
    // スタートコード／ストップコードとして、コードの始まりと終わりはアルファベット(A-D)のいずれかを使用してください。
    const regexp = /^[A-Da-d]([0-9\-\.\$\:\/\+])+[A-Da-d]$/;
    return regexp.test(input);
  } else if (type === "itf14") {
    // 有効文字は数値(0-9)のみ。 チェックデジットを含まない13桁orチェックデジットを含む14桁。
    const regexp = /^\d{13}$|^\d{14}$/;
    return regexp.test(input) && validateCheckDigit(input, 14);
  } else if (type === "upca") {
    // 有効文字は数値(0-9)のみ。 チェックデジットを含まない11桁orチェックデジットを含む12桁。
    const regexp = /^\d{11}$|^\d{12}$/;
    return regexp.test(input) && validateCheckDigit(input, 12);
  } else if (type === "upce") {
    // 有効文字は数値(0-9)のみ。 1桁目に指定できる数字(ナンバーシステムキャラクタ)は0のみ。
    // チェックデジットを含まない7桁orチェックデジットを含む8桁。
    const regexp = /^0(\d{6}$|\d{7}$)/;
    return regexp.test(input) && validateCheckDigit(input, 8);
  }
  return false;
};

export const createBarCode = async ({
  type,
  input,
  width,
  height,
  backgroundColor,
}: {
  type: BarCodeType;
  input: string | null;
  width: number;
  height: number;
  backgroundColor?: string;
}): Promise<Buffer | null> => {
  if (input && validateBarcodeInput(type, input)) {
    const bwipjsArg: ToBufferOptions = {
      bcid: type === "nw7" ? "rationalizedCodabar" : type,
      text: input,
      scale: 5,
      width,
      height,
      includetext: true,
    };
    if (backgroundColor) {
      bwipjsArg.backgroundcolor = backgroundColor;
    }

    let res: Buffer;

    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas");
      bwipjsBrowser.toCanvas(canvas, bwipjsArg);
      const dataUrl = canvas.toDataURL("image/png");
      res = b64toUint8Array(dataUrl).buffer as Buffer;
    } else {
      res = await bwipjsNode.toBuffer(bwipjsArg);
    }

    return res;
  } else {
    return null;
  }
};

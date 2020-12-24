//@ts-ignore
import * as bwipjs from "bwip-js/dist/node-bwipjs.js";
import { BarCodeType } from "./type";

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
    // 有効文字は数値(0-9)のみ。標準タイプはチェックデジットを含まない12桁orチェックデジットを含む13桁
    const regexp = /^\d{12}$|^\d{13}$/;
    return regexp.test(input);
  } else if (type === "ean8") {
    // 有効文字は数値(0-9)のみ。短縮タイプはチェックデジットを含まない7桁orチェックデジットを含む8桁
    const regexp = /^\d{7}$|^\d{8}$/;
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
    // 有効文字は数値(0-9)のみ。 チェックデジットを含まない13桁orチェックデジットを含む14桁
    const regexp = /^\d{13}$|^\d{14}$/;
    return regexp.test(input);
  }
  return false;
};

export const createBarCode = async ({
  type,
  input,
  width,
  height,
}: {
  type: BarCodeType;
  input: string | null;
  width: number;
  height: number;
}): Promise<Buffer | null> => {
  if (input && validateBarcodeInput(type, input)) {
    const bwipjsArg = {
      bcid: type === "nw7" ? "rationalizedCodabar" : type,
      text: input,
      scale: 5,
      width,
      height,
      includetext: true,
    };
    //@ts-ignore
    const buffer = bwipjs.toBuffer
      ? await bwipjs.toBuffer(bwipjsArg).catch(() => null)
      : await bwipjs.default.toBuffer(bwipjsArg).catch(() => null);
    return buffer;
  } else {
    return null;
  }
};

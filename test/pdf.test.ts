import { TemplateData } from "../src/type";
import { validateBarcodeInput, createDocDefinition } from "../src/pdf";

type Input = { test: string };

describe("validateBarcodeInput", () => {
  test("qrcode", () => {
    // 漢字を含まない500文字以下
    const type = "qrcode";
    const valid = "https://www.google.com/";
    const invalid1 = "漢字を含む文字列";
    const invalid2 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQ";
    const blank = "";
    expect(validateBarcodeInput(type, valid)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test("japanpost", () => {
    // https://barcode-place.azurewebsites.net/Barcode/zip
    // 郵便番号は数字(0-9)のみ、住所表示番号は英数字(0-9,A-Z)とハイフン(-)が使用可能です。
    const type = "japanpost";
    const valid1 = "10000131-3-2-503";
    const valid2 = "10000131-3-2-B503";
    const invalid1 = "invalid";
    const invalid2 = "10000131=3=2-503";
    const invalid3 = "10000131=3=2-503";
    const invalid4 = "10000131-3-2-b503";
    const blank = "";
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, invalid4)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test("ean13", () => {
    // https://barcode-place.azurewebsites.net/Barcode/jan
    // 有効文字は数値(0-9)のみ。標準タイプはチェックデジットを含まない12桁
    const type = "ean13";
    const valid = "111111111111";
    const invalid1 = "1111111111111";
    const invalid2 = "111";
    const invalid3 = "111111111111111111111111";
    const invalid4 = "invalid";
    const invalid5 = "11111a111111";
    const blank = "";
    expect(validateBarcodeInput(type, valid)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, invalid4)).toEqual(false);
    expect(validateBarcodeInput(type, invalid5)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test("ean8", () => {
    // https://barcode-place.azurewebsites.net/Barcode/jan
    // 有効文字は数値(0-9)のみ。短縮タイプはチェックデジットを含まない7桁
    const type = "ean8";
    const valid = "1111111";
    const invalid1 = "11111111";
    const invalid2 = "111";
    const invalid3 = "11111111111111111111";
    const invalid4 = "invalid";
    const invalid5 = "111a111";
    const blank = "";
    expect(validateBarcodeInput(type, valid)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, invalid4)).toEqual(false);
    expect(validateBarcodeInput(type, invalid5)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test("code39", () => {
    // https://barcode-place.azurewebsites.net/Barcode/code39
    // CODE39は数字(0-9)、アルファベット大文字(A-Z)、記号(-.$/+%)、半角スペースに対応しています。
    const type = "code39";
    const valid1 = "12345";
    const valid2 = "ABCDE";
    const valid3 = "1A2B3C4D5G";
    const valid4 = "1-A $2/B+3%C4D5G";
    const invalid1 = "123a45";
    const invalid2 = "1-A$2/B+3%C4=D5G";
    const blank = "";
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, valid4)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test("code128", () => {
    // https://www.keyence.co.jp/ss/products/autoid/codereader/basic_code128.jsp
    // コンピュータのキーボードから打てる文字（漢字、ひらがな、カタカナ以外）可能
    const type = "code128";
    const valid1 = "12345";
    const valid2 = "1-A$2/B+3%C4=D5G";
    const valid3 = "1-A$2/B+3%C4=D5Ga~";
    const invalid1 = "1-A$2/B+3%C4=D5Gひらがな";
    const invalid2 = "1-A$2/B+3%C4=D5G〜";
    const invalid3 = "1ーA$2・B＋3%C4=D5G〜";
    const blank = "";
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test("nw7", () => {
    // https://barcode-place.azurewebsites.net/Barcode/nw7
    // https://en.wikipedia.org/wiki/Codabar
    // NW-7は数字(0-9)と記号(-.$:/+)に対応しています。
    // スタートコード／ストップコードとして、コードの始まりと終わりはアルファベット(A-D)のいずれかを使用してください。
    const type = "nw7";
    const valid1 = "A12345D";
    const valid2 = "A$2/+345D";
    const valid3 = "a4321D";
    const invalid1 = "A12345G";
    const invalid2 = "A12a45D";
    const blank = "";
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test("itf14", () => {
    // https://barcode-place.azurewebsites.net/Barcode/itf
    // 有効文字は数値(0-9)のみ。 チェックデジットを含まない13桁です。
    const type = "itf14";
    const valid = "1111111111111";
    const invalid1 = "111";
    const invalid2 = "11111111111111";
    const invalid3 = "11111111111111111111111111111";
    const blank = "";
    expect(validateBarcodeInput(type, valid)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
});

describe("createDocDefinition", () => {
  const dummyImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";
  const testImage =
    "data:image/jpeg;base64,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";
  const testSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="217.6px" height="71.4px" viewBox="0 0 217.6 71.4" style="enable-background:new 0 0 217.6 71.4;" xml:space="preserve"><defs></defs><g> <path d="M31.1,34.2c15.7-4.4,23.3-15.3,23.4-21.5C51.5,1.6,34.3,0.2,21,10.3l-4.1-5.7C33.6-4,57.8-1,61,17.2  c-5,8.9-12.4,15-22.5,17.8l0.2,0.6c9.2,0,18.6,7.5,15,17.7C46.6,73.3,19.2,75.4,0,65.6l0.9-2c4.8,2.3,9.7,3.7,14.5,4.3l-3.8-3  L32.7,5.6l6,3.2L17.4,68.2c13.7,1,25.8-5.1,29.9-16.8c3.1-8.8-4.3-14.3-14.5-12.3L31.1,34.2z"/> <path d="M76.6,36.2c0,0-2.4,4.4-5.3,12.1l0.3,0.1c3.2-5.1,10.5-14.9,12.6-16.4c1.4-1,2.9-1.1,4.3,0s2.4,2.4,3.1,3.7  c2.7,4.8-4,11.1-10,12.7c-0.5-0.4-0.8-1.1-0.8-1.1c4.8-2.9,6.3-8,5.6-13.2c-7.9,5.8-14,15.1-19.3,26.7c-1.1,3.3-2.2,6.7-3.3,10.6  L58,66.5l12.9-35.2L76.6,36.2z"/> <path d="M122,54.2c-1.5,4.1-2.5,9.9-2.5,14.3c8.3-4.2,14.8-10.4,20.5-17.6l1.2,0.6c-5.2,7.5-12,14.6-20.1,19.9  c-7.1-2-8.1-9.7-4.8-18.8l-0.5-0.3c-3.8,6.6-8.8,12.3-16.2,18.4c-6.7-2.4-8.8-9.6-6.9-16.5c1.9-6.8,8.6-23.7,8.6-23.7l5.4,4.9  c0,0-5.3,14.8-6.7,18.8c-1.5,4.1-2,9.9-2,14.3c10.9-7.7,17.9-18.4,22.5-30.4c1.5-4.3,2.8-7.6,2.8-7.6l5.3,4.9  C128.6,35.4,123.4,50.2,122,54.2z"/> <path d="M151.4,35.9c0,0-7.9,17.9-10.4,24.3l0.5,0.4c5.7-10.4,14.2-21.6,21.9-28.6c0.9-0.8,3-1,4.2,0c0.7,0.6,3.3,3.1,3.5,3.3  c1.3,1.3,1.8,3.4,1,5.2c-2.2,4.9-4.8,11.5-6.2,14.6c-1.9,4.5-3.3,9-2.7,13.4c8.4-4.2,14.8-10.4,20.5-17.6l1.2,0.6  c-5.2,7.6-12,14.7-20.1,19.8c-6.4-2.9-10-9.1-7-16.1c1.9-4.5,5.8-13.3,8-18.9c0.4-0.9,0.3-1.7-0.2-1.7c-3.8,0-24.6,27.3-26.6,36.8  l-6.1-4.9l12.7-35.2L151.4,35.9z"/> <path d="M209.1,36.1c0.1,4.1-0.3,8.3-0.9,11.7c2.1,0.8,5.2,0.9,9.4,0l-0.9,1.7c-3.4,0.8-6.4,0.6-8.8-0.2c-3,12.6-11,20.1-20.4,22  c-16.2-11.8-5.7-33.5,8.3-40.1l4.1,6.6c-11.5,4-17.8,19.5-13.3,30.7c8.5-2.4,15.9-10,19.2-20c-5.4-3-6.9-9.7-2-15.8l2-1.4  L209.1,36.1z M207.6,37.9c-3.6,2.5-3.5,6.7-1.3,8.8C207.1,43.9,207.5,41,207.6,37.9z"/></g></svg>`;

  test("Background Image", async () => {
    const labelDatas = [{ test: "hello1" }, { test: "hello2" }];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "text",
          alignment: "left",
          fontSize: 10,
          fontName: "FontName2",
          characterSpacing: 0,
          lineHeight: 1,
        },
      },
      background: testImage,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName1",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName1" },
      content: [
        {
          image: testImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          alignment: "left",
          columns: [
            {
              text: "hello1",
              width: 56.692,
              font: "FontName2",
              fontSize: 10,
              characterSpacing: 0,
              lineHeight: 1,
            },
          ],
        },
        {
          image: testImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          alignment: "left",
          columns: [
            {
              text: "hello2",
              width: 56.692,
              font: "FontName2",
              fontSize: 10,
              characterSpacing: 0,
              lineHeight: 1,
            },
          ],
        },
      ],
    });
  });

  test("Background Svg", async () => {
    const labelDatas = [{ test: "hello1" }, { test: "hello2" }];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "text",
          alignment: "left",
          fontSize: 10,
          fontName: "FontName2",
          characterSpacing: 0,
          lineHeight: 1,
        },
      },
      background: testSvg,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName1",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName1" },
      content: [
        {
          svg: testSvg,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          alignment: "left",
          columns: [
            {
              text: "hello1",
              width: 56.692,
              font: "FontName2",
              fontSize: 10,
              characterSpacing: 0,
              lineHeight: 1,
            },
          ],
        },
        {
          svg: testSvg,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          alignment: "left",
          columns: [
            {
              text: "hello2",
              width: 56.692,
              font: "FontName2",
              fontSize: 10,
              characterSpacing: 0,
              lineHeight: 1,
            },
          ],
        },
      ],
    });
  });

  test("Text Type", async () => {
    const labelDatas = [{ test: "hello1" }, { test: "hello2" }];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "text",
          alignment: "left",
          fontSize: 10,
          fontName: "FontName2",
          characterSpacing: 0,
          lineHeight: 1,
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName1",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName1" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          alignment: "left",
          columns: [
            {
              text: "hello1",
              width: 56.692,
              font: "FontName2",
              fontSize: 10,
              characterSpacing: 0,
              lineHeight: 1,
            },
          ],
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          alignment: "left",
          columns: [
            {
              text: "hello2",
              width: 56.692,
              font: "FontName2",
              fontSize: 10,
              characterSpacing: 0,
              lineHeight: 1,
            },
          ],
        },
      ],
    });
  });

  test("Image Type", async () => {
    const labelDatas = [
      {
        test: testImage,
      },
      {
        test: testImage,
      },
    ];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "image",
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image: testImage,
          width: 56.692,
          height: 56.692,
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image: testImage,
          width: 56.692,
          height: 56.692,
        },
      ],
    });
  });

  test("Svg Type", async () => {
    const labelDatas = [
      {
        test: testSvg,
      },
      {
        test: testSvg,
      },
    ];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "svg",
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          svg: testSvg,
          width: 56.692,
          height: 56.692,
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          svg: testSvg,
          width: 56.692,
          height: 56.692,
        },
      ],
    });
  });

  test("QRCode Type", async () => {
    const labelDatas = [
      {
        test: "hoge",
      },
      {
        test: "hoge",
      },
    ];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "qrcode",
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
      ],
    });
  });

  test("Japanpost Type", async () => {
    const labelDatas = [
      {
        test: "10000131-3-2-503",
      },
      {
        test: "10000131-3-2-503",
      },
    ];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "japanpost",
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
      ],
    });
  });

  test("Ean13 Type", async () => {
    const labelDatas = [
      {
        test: "111111111111",
      },
      {
        test: "111111111111",
      },
    ];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "ean13",
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR0AAAFWCAYAAABU9UnUAAAAHnRFWHRTb2Z0d2FyZQBid2lwLWpzLm1ldGFmbG9vci5jb21Tnbi0AAAcOElEQVR4nOWTwapDUQgD7///dN+2m9IpccA8A2cTDqNBfZ7neb29d33yP/359b/NTDjtfdrM/5rrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RF+Zf16TqQyMugY3AAAAAElFTkSuQmCC",
          width: 56.692,
          height: 56.692,
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR0AAAFWCAYAAABU9UnUAAAAHnRFWHRTb2Z0d2FyZQBid2lwLWpzLm1ldGFmbG9vci5jb21Tnbi0AAAcOElEQVR4nOWTwapDUQgD7///dN+2m9IpccA8A2cTDqNBfZ7neb29d33yP/359b/NTDjtfdrM/5rrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RIiZFJ46PINpDKmlzw0L2pjrMpP4RF+Zf16TqQyMugY3AAAAAElFTkSuQmCC",
          width: 56.692,
          height: 56.692,
        },
      ],
    });
  });

  test("Ean8 Type", async () => {
    const labelDatas = [
      {
        test: "1111111",
      },
      {
        test: "1111111",
      },
    ];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "ean8",
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
      ],
    });
  });

  test("Code39 Type", async () => {
    const labelDatas = [
      {
        test: "12345",
      },
      {
        test: "12345",
      },
    ];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "code39",
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
      ],
    });
  });

  test("Code128 Type", async () => {
    const labelDatas = [
      {
        test: "12345",
      },
      {
        test: "12345",
      },
    ];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "code128",
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
      ],
    });
  });

  test("Nw7 Type", async () => {
    const labelDatas = [
      {
        test: "A12345D",
      },
      {
        test: "A12345D",
      },
    ];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "nw7",
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
      ],
    });
  });

  test("Itf14 Type", async () => {
    const labelDatas = [
      {
        test: "1111111111111",
      },
      {
        test: "1111111111111",
      },
    ];
    const templateData: TemplateData<Input> = {
      schema: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          height: 20,
          type: "itf14",
        },
      },
      background: null,
      pageSize: {
        width: 100,
        height: 100,
      },
      fontName: "FontName",
    };
    const dd = await createDocDefinition(labelDatas, templateData);
    expect(dd).toEqual({
      pageSize: { width: 283.46, height: 283.46 },
      pageMargins: [0, 0, 0, -56.692],
      defaultStyle: { font: "FontName" },
      content: [
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
        {
          image: dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 283.46,
          pageBreak: "before",
        },
        {
          absolutePosition: { x: 28.346, y: 28.346 },
          image:
            "data:image/png;base64,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",
          width: 56.692,
          height: 56.692,
        },
      ],
    });
  });
});

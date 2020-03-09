//@ts-ignore
import * as pdfMake from "pdfmake/build/pdfmake";
import { roboto } from "./roboto";
import { createDocDefinition } from "./pdf";
import { TemplateData } from "./type";

const labelmake = <T>({
  input,
  template,
  font
}: {
  input: { [key: string]: string }[];
  template: TemplateData<T>;
  font?: { [key: string]: string };
}): Promise<Buffer> => {
  return createDocDefinition(input, template).then(
    docDefinition =>
      new Promise(resolve => {
        if (!pdfMake.fonts) pdfMake.fonts = {};
        if (!pdfMake.vfs) pdfMake.vfs = {};
        if (font) {
          Object.entries(font).forEach(entry => {
            const [name, value] = entry;
            if (!pdfMake.fonts[name]) pdfMake.fonts[name] = {};
            if (!pdfMake.vfs[name]) pdfMake.vfs[name] = "";
            pdfMake.vfs[name] = value;
            pdfMake.fonts[name] = { normal: name };
          });
        } else {
          pdfMake.vfs.Roboto = roboto;
          pdfMake.fonts = {
            Roboto: { normal: "Roboto" }
          };
        }
        pdfMake.createPdf(docDefinition).getDataUrl((base64: string) => {
          const data = base64.split(",")[1];
          const bin = Buffer.from(data, "base64").toString("binary");
          const arraybuffer = new Uint8Array(bin.length);
          for (let i = 0, l = bin.length; l > i; i++) {
            arraybuffer[i] = bin.charCodeAt(i);
          }
          resolve(Buffer.from(arraybuffer));
        });
      })
  );
};

export default labelmake;

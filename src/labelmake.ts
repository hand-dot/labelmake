import PdfMake from "./PdfMake";
import { Buffer as Vuffer } from "buffer";
import { createDocDefinition } from "./pdf";
import { TemplateData } from "./type";

const pdfMake = new PdfMake();

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
        if (font) {
          Object.entries(font).forEach(entry => {
            const [name, value] = entry;
            pdfMake.setFont(name, value);
          });
        }
        pdfMake.createPdf(docDefinition).getDataUrl((base64: string) => {
          const data = base64.split(",")[1];
          const bin = Vuffer.from(data, "base64").toString("binary");
          const arraybuffer = new Uint8Array(bin.length);
          for (let i = 0, l = bin.length; l > i; i++) {
            arraybuffer[i] = bin.charCodeAt(i);
          }
          resolve(Vuffer.from(arraybuffer));
        });
      })
  );
};

export default labelmake;

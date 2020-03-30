import PdfMake from "./pdfMake";
import { createDocDefinition } from "./pdf";
import { TemplateData } from "./type";

const info = { info: { creator: "labelmake.jp", producer: "labelmake.jp" } };
const pdfMake = new PdfMake();

const labelmake = <T>(data: {
  input: { [key: string]: string }[];
  template: TemplateData<T>;
  font?: { [key: string]: string };
}): Promise<Buffer> =>
  createDocDefinition(data.input, data.template).then(
    docDefinition =>
      new Promise(resolve => {
        if (data.font) {
          Object.entries(data.font).forEach(entry => {
            const [name, value] = entry;
            pdfMake.setFont(name, value);
          });
        }
        pdfMake
          .createPdf(Object.assign(info, docDefinition))
          .getBuffer(resolve);
      })
  );

export default labelmake;

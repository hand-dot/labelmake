import PdfMake from "./pdfMake";
import { createDocDefinition } from "./pdf";
import { TemplateData, Setting } from "./type";

const info = { info: { creator: "labelmake.jp", producer: "labelmake.jp" } };
const pdfMake = new PdfMake();

const labelmake = <T>(data: {
  inputs: { [key: string]: string }[];
  templates: TemplateData<T>[];
  setting: Setting;
  font?: { [key: string]: string };
}): Promise<Buffer> =>
  createDocDefinition(data.inputs, data.templates, data.setting).then(
    (docDefinition) =>
      new Promise((resolve) => {
        if (data.font) {
          Object.entries(data.font).forEach((entry) => {
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

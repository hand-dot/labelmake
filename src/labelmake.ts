import PdfMake from "./pdfMake";
import { createDocDefinition } from "./pdf";
import { Template, Setting } from "./type";

const info = { creator: "labelmake.jp", producer: "labelmake.jp" };
const pdfMake = new PdfMake();

const labelmake = (data: {
  inputs: { [key: string]: string }[];
  template: Template;
  setting?: Setting;
  font?: { [key: string]: string };
}): Promise<Buffer> =>
  createDocDefinition(data.inputs, data.template).then(
    (docDefinition) =>
      new Promise((resolve) => {
        if (data.font) {
          Object.entries(data.font).forEach((entry) => {
            const [name, value] = entry;
            pdfMake.setFont(name, value);
          });
        }
        pdfMake
          .createPdf(
            Object.assign(data.setting ? data.setting : { info }, docDefinition)
          )
          .getBuffer(resolve);
      })
  );

export default labelmake;

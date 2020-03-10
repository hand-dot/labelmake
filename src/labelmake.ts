import PdfMake from "./PdfMake";
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
        pdfMake.createPdf(docDefinition).getBuffer(resolve);
      })
  );
};

export default labelmake;

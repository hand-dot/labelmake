import { createPdf } from "./pdf";
import { Template } from "./type";

const labelmake = (data: {
  inputs: { [key: string]: string }[];
  template: Template;
  font?: { [key: string]: string };
}): Promise<Uint8Array | undefined> => createPdf(data);

export default labelmake;

//@ts-ignore
import * as pdfMake from "pdfmake/build/pdfmake";
import { roboto } from "./roboto";

export default class {
  constructor() {
    if (!this.pdfMake.fonts) this.pdfMake.fonts = {};
    if (!this.pdfMake.vfs) this.pdfMake.vfs = {};
    this.pdfMake.vfs.Roboto = roboto;
    this.pdfMake.fonts = {
      Roboto: { normal: "Roboto" }
    };
  }
  private pdfMake = pdfMake;
  setFont(name: string, value: string) {
    if (!this.pdfMake.fonts[name]) this.pdfMake.fonts[name] = {};
    if (!this.pdfMake.vfs[name]) this.pdfMake.vfs[name] = "";
    this.pdfMake.vfs[name] = value;
    this.pdfMake.fonts[name] = { normal: name };
  }
  createPdf(docDefinition: any) {
    if (this.pdfMake.createPdf) {
      return this.pdfMake.createPdf(docDefinition);
    } else {
      //@ts-ignore
      return this.pdfMake.default.createPdf(docDefinition);
    }
  }
}

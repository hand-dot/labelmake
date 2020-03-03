import * as pdfMake from "pdfmake/build/pdfmake";
import pdf from "./pdf";
import { TemplateData } from "./type";
class Labelmake {
  private pdfMake = pdfMake;
  registerFont(name: string, value: string) {
    if (!this.pdfMake.vfs) {
      this.pdfMake.vfs = {};
    }
    if (!this.pdfMake.vfs[name]) {
      this.pdfMake.vfs[name] = "";
    }
    this.pdfMake.vfs[name] = value;

    if (!this.pdfMake.fonts) {
      this.pdfMake.fonts = {};
    }
    if (!this.pdfMake.fonts[name]) {
      this.pdfMake.fonts[name] = {};
    }
    this.pdfMake.fonts[name] = {
      normal: name
    };
  }
  create(templateData: TemplateData, datas: { [key: string]: string }[]) {
    return pdf(datas, templateData, this.pdfMake);
  }
}

export default Labelmake;

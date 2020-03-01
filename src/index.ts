import { Template } from "./type";
class Labelmake {
  private font: { [key: string]: string } = {};
  private template: { [key: string]: Template } = {};
  registerFont(key: string, value: string) {
    this.font[key] = value;
  }
  registerTemplate(key: string, value: Template) {
    this.template[key] = value;
  }
  // key or templateを第一引数にとる？
  create(datas: { [key: string]: string }[]) {
    return datas;
  }
}

export default Labelmake;

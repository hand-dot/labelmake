//@ts-ignore
import { sans_vfs_fonts } from "./fonts/sans_vfs_fonts";
//@ts-ignore
import { serif_vfs_fonts } from "./fonts/serif_vfs_fonts";
import fs from "fs";
import Labelmake from "../src/index";
import { TemplateData } from "../src/type";

describe("test", () => {
  test("NotoSansCJKjp", async () => {
    const labelmake = new Labelmake();
    labelmake.registerFont("NotoSansCJKjp", sans_vfs_fonts);
    const templateData: TemplateData = {
      image: null,
      position: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          alignment: "left",
          size: 100,
          space: 0,
          type: "text",
          lineHeight: 1
        }
      },
      pageSize: {
        width: 100,
        height: 100
      },
      fontName: "NotoSansCJKjp"
    };
    const pdf = await labelmake.create(templateData, [{ test: "hello" }]);
    fs.writeFileSync("./sans.pdf", pdf);
  });
    test("NotoSerifCJKjp", async () => {
    const labelmake = new Labelmake();
    labelmake.registerFont("NotoSerifCJKjp", serif_vfs_fonts);
    const templateData: TemplateData = {
      image: null,
      position: {
        test: {
          position: { x: 10, y: 10 },
          width: 20,
          alignment: "left",
          size: 100,
          space: 0,
          type: "text",
          lineHeight: 1
        }
      },
      pageSize: {
        width: 100,
        height: 100
      },
      fontName: "NotoSerifCJKjp"
    };
    const pdf = await labelmake.create(templateData, [{ test: "hello" }]);
    fs.writeFileSync("./serif.pdf", pdf);
  });
});

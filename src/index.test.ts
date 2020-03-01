import Labelmake from "./index";
describe("test", () => {
  test("test", () => {
    const labelmake = new Labelmake();
    const pdf = labelmake.create([{test:'test'}])
    expect(pdf).toEqual([{test:'test'}]);
  });
});

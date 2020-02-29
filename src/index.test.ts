import hi from "./index";
describe("greet", () => {
  test("should say hello to Tom.", () => {
    expect(hi("Tom")).toBe("Hello Tom");
  });
});

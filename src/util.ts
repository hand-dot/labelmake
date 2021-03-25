export const uniq = <T>(array: Array<T>) => Array.from(new Set(array));

export const hex2rgb = (hex: string) => {
  if (hex.slice(0, 1) === "#") hex = hex.slice(1);
  if (hex.length === 3)
    hex =
      hex.slice(0, 1) +
      hex.slice(0, 1) +
      hex.slice(1, 2) +
      hex.slice(1, 2) +
      hex.slice(2, 3) +
      hex.slice(2, 3);

  return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((str) =>
    parseInt(str, 16)
  );
};

export const mm2pt = (mm: number): number => {
  // https://www.ddc.co.jp/words/archives/20090701114500.html
  const ptRatio = 2.8346;
  return parseFloat(String(mm)) * ptRatio;
};

export const calcX = (
    x: number,
    alignment: "left" | "right" | "center",
    boxWidth: number,
    textWidth: number
  ) => {
    let addition = 0;
    if (alignment === "center") {
      addition = (boxWidth - textWidth) / 2;
    } else if (alignment === "right") {
      addition = boxWidth - textWidth;
    }
    return mm2pt(x) + addition;
  };
  
  export const calcY = (y: number, height: number, itemHeight: number) =>
    height - mm2pt(y) - itemHeight;
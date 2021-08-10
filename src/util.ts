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


type IsOverEval = (testString: string) => boolean
/**
 * Incrementally check the current line for it's real length 
 * and return the position where it exceeds the bbox width.
 * 
 * return `null` to indicate if inputLine is shorter as the available bbox
 */
export const getOverPosition = (inputLine: string, isOverEval: IsOverEval) => {
  for(let i=0; i <= inputLine.length; i++){
      if(isOverEval(inputLine.substr(0,i))){
          return i
      }
  }
  return null;
}

/**
* Get position of the split. Split the exceeding line at 
* the last whitepsace bevor it exceeds the bounding box width.
*/
const getSplitPosition = (inputLine: string, isOverEval: IsOverEval) => {
  const overPos = getOverPosition(inputLine, isOverEval)
  /**
   * if input line is shorter as the available space. We split at the end of the line
   */
  if(overPos === null) return inputLine.length;
  let overPosTmp = overPos
  while(inputLine[overPosTmp] !== " " && overPosTmp >= 0) overPosTmp--;
  /**
   * for very long lines with no whitespace use the original overPos and 
   * split one char bevor so we do not overfill the bbox
   */
  return overPosTmp > 0 ? overPosTmp : overPos - 1;
}

/** 
* recursivly split the line at getSplitPosition. 
* If there is some leftover, split the rest again in the same manner.
*/
export const getSplittedLines = (inputLine: string, isOverEval: IsOverEval): string[] => {
  const splitPos = getSplitPosition(inputLine, isOverEval)
  const splittedLine = inputLine.substr(0, splitPos)
  const rest = inputLine.slice(splitPos).trimLeft()
  /**
   * end recursion if there is no rest, return single splitted line in an array
   * so we can join them over the recursion
   */
  if(rest.length === 0){
      return [splittedLine];
  } else {
      return [splittedLine, ...getSplittedLines(rest, isOverEval)]
  }
}
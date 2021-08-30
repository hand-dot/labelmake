type TemplateType =
  | "text"
  | "image"
  | "qrcode"
  | "japanpost"
  | "ean13"
  | "ean8"
  | "code39"
  | "code128"
  | "nw7"
  | "itf14"
  | "upca"
  | "upce";

export type BarCodeType = Exclude<TemplateType, "text" | "image">;

export type Alignment = "left" | "right" | "center";

export interface PageSize {
  height: number;
  width: number;
}
export interface TemplateSchema {
  type: TemplateType;
  position: { x: number; y: number };
  width: number;
  height: number;
  rotate?: number;
  alignment?: Alignment;
  fontSize?: number;
  fontName?: string;
  fontColor?: string;
  backgroundColor?: string;
  characterSpacing?: number;
  lineHeight?: number;
}

interface SubsetFont {
  data: string | Uint8Array | ArrayBuffer;
  subset: boolean;
}

interface Font {
  [key: string]: string | Uint8Array | ArrayBuffer | SubsetFont;
}

export interface Args {
  inputs: { [key: string]: string }[];
  template: Template;
  font?: Font;
  splitThreshold?: number;
}

export const isPageSize = (
  args: PageSize | string | Uint8Array | ArrayBuffer
): args is PageSize => typeof args === "object" && "width" in args;

export const isSubsetFont = (
  v: string | Uint8Array | ArrayBuffer | SubsetFont
): v is SubsetFont => typeof v === "object" && !!v && "data" in v;

export interface Template {
  schemas: { [key: string]: TemplateSchema }[];
  basePdf: PageSize | string | Uint8Array | ArrayBuffer;
  fontName?: string;
}

export type _Template = Template & {
  sampledata: { [key: string]: string }[];
};

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
  | "itf14";

export type BarCodeType = Exclude<TemplateType, "text" | "image">;

interface TemplateSchema {
  type: TemplateType;
  position: { x: number; y: number };
  width: number;
  height: number;
  rotate: number;
  alignment?: "left" | "right" | "center";
  fontSize?: number;
  fontName?: string;
  fontColor?: string;
  characterSpacing?: number;
  lineHeight?: number;
}

export interface Template {
  schemas: { [key: string]: TemplateSchema }[];
  basePdf: string;
  fontName: string;
}

export interface _Template {
  sampledata: { [key: string]: string }[];
  schemas: { [key: string]: TemplateSchema }[];
  basePdf: string;
  fontName: string;
}
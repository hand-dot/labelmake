export type TemplateType =
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

export interface TemplatePosition {
  position: { x: number; y: number };
  width: number;
  alignment: "left" | "right" | "center";
  size: number;
  space: number;
  type: TemplateType;
  lineHeight: number;
}
export interface PageSize {
  width: number;
  height: number;
}

export interface Template {
  sampledata: { [key: string]: string }[];
  position: { [key: string]: TemplatePosition };
  image: string | null;
  pageSize: PageSize;
  columns: { data: string; title: string }[];
  dataSchema: { [key: string]: null };
  name: string;
  id: string;
  fontName: string;
}

export type TemplateData = Pick<
  Template,
  "image" | "position" | "pageSize" | "fontName"
>;

interface Style {
  font?: any;
  fontSize?: number;
  fontFeatures?: any;
  bold?: boolean;
  italics?: boolean;
  alignment?: Alignment;
  color?: string;
  columnGap?: any;
  fillColor?: string;
  decoration?: any;
  decorationany?: any;
  decorationColor?: string;
  background?: any;
  lineHeight?: number;
  characterSpacing?: number;
  noWrap?: boolean;
  markerColor?: string;
  leadingIndent?: any;
  [additionalProperty: string]: any;
}
type Margins = number | [number, number] | [number, number, number, number];
type Alignment = "left" | "right" | "justify" | "center" | string;

export interface Content {
  style?: string | string[];
  margin?: Margins;
  text?: string | string[] | Content[];
  columns?: Content[];
  stack?: Content[];
  image?: string;
  width?: string | number;
  height?: string | number;
  fit?: [number, number];
  pageBreak?: "before" | "after";
  alignment?: Alignment;
  ul?: Content[];
  ol?: Content[];
  [additionalProperty: string]: any;
}

export interface DocDefinition {
  content: Content | Array<string | Content>;
  pageSize?: { width: number; height: number };
  defaultStyle?: Style;
  pageMargins: Margins;
}

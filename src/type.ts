export type TemplateSchemaType =
  | "text"
  | "image"
  | "svg"
  | "qrcode"
  | "japanpost"
  | "ean13"
  | "ean8"
  | "code39"
  | "code128"
  | "nw7"
  | "itf14";

export type BarCodeType = Exclude<TemplateSchemaType, "text" | "image" | "svg">;

export interface TemplateSchema {
  type: TemplateSchemaType;
  position: { x: number; y: number };
  width: number;
  height: number;
  alignment?: "left" | "right" | "center";
  fontName?: string;
  fontSize?: number;
  characterSpacing?: number;
  lineHeight?: number;
}
interface PageSize {
  width: number;
  height: number;
}

export type TemplateData<T> = {
  schema: { [P in keyof T]: TemplateSchema };
  background: string | null;
  pageSize: PageSize;
  fontName?: string;
};
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
  svg?: string;
  width?: string | number;
  height?: string | number;
  fit?: [number, number];
  pageBreak?: "before" | "after" | "";
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

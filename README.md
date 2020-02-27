# labelmake

![bank-phrom-Tzm3Oyu_6sk-unsplash](https://user-images.githubusercontent.com/24843808/75454135-4550d000-59b8-11ea-91a4-83fd80dbc633.jpg)

A JavaScript PDF generation library for Node and the browser.  
Specializes in variable data printing. makes easy to build an automatic typesetting system.

## Description

I just realised that Other PDF generation libraries makes program complex by imperative operations.

So, I developed this library aiming at a declarative style programing PDF creation library.

The big difference from other libraries is the perfect separation of layout and variable datas.
Therefore, user can use this library considering only primitive variable datas.

## Methods
- registerTemplate
- registerFont
- create

## Features
Variable data supports the following input types
- Text
- Image
- SVG
- Barcode
  - QR Code
  - Japan Post 4 State Customer Code
  - EAN-13
  - EAN-8
  - Code 39
  - Code 128
  - Codabar(NW-7)
  - ITF-14

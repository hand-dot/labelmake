![Unit Testing](https://github.com/hand-dot/labelmake/workflows/Unit%20Testing/badge.svg)
[![](https://data.jsdelivr.com/v1/package/npm/labelmake/badge)](https://www.jsdelivr.com/package/npm/labelmake)

# labelmake

![top](./assets/readme-top.png)

labelmake is a declarative style PDF generation library for Node and the browser.  

## Description

I am developing [labelmake.jp](https://labelmake.jp/). That is PDF creation service that can do [variable data printing](https://en.wikipedia.org/wiki/Variable_data_printing).

I just realised in developing labelmake.jp that other PDF generation libraries makes program complex by imperative operations.

So, I developed this library aiming at a more simple declarative style PDF generation library and released it as OSS.

## Installation

Use [npm](https://www.npmjs.com/package/labelmake) to install the latest version.

```
npm install labelmake
```

You can use Yarn, NuGet or other methods as well. You can load it directly from [jsDelivr](https://www.jsdelivr.com/package/npm/labelmake).

## Usage

### Data

template

```json
{
    "background": null,
    "schema": {
      "test1": {
        "position": { "x": 0, "y": 0 },
        "width": 50,
        "type": "qrcode"
      },
      "test2": {
        "position": { "x": 60, "y": 60 },
        "width": 50,
        "type": "text",
        "alignment": "left",
        "fontSize": 8,
        "characterSpacing": 0,
        "lineHeight": 1
      }
    },
    "pageSize": {
      "width": 100,
      "height": 100
    }
};
```

input

```json
[{ "test1": "aa", "test2": "aa" }]
```

### Node

```js
const fs = require("fs");
const labelmake = require("labelmake");
const template = require("../template");
const input = require("../input");

labelmake({ input, template }).then(pdf => {
  fs.writeFileSync(__dirname + "/my.pdf", pdf);
});
```

### Browser

```html
<html>
  <iframe id="iframe" width="100%" height="700"></iframe>
  <script src="https://cdn.jsdelivr.net/npm/labelmake/dist/labelmake.min.js"></script>
  <script type="text/javascript" src="../template.js"></script>
  <script type="text/javascript" src="../input.js"></script>
  <script type="text/javascript">
    labelmake({ input, template }).then(buffer => {
      const blob = new Blob([buffer.buffer], { type: "application/pdf" });
      document.getElementById("iframe").src = URL.createObjectURL(blob);
    });
  </script>
</html>
```

### Result

![result](./assets/result.png)

You can see demo in [example](https://github.com/hand-dot/labelmake/tree/master/example) folder.

## Features

- Template data Template data supports embedding of Image (jpeg, png) and SVG.
- Input data supports the following input types.
  - Text(Uses the Roboto font by default. Can use custom fonts)
  - Image(jpeg, png)
  - SVG
  - Barcode(Checksum is calculated automatically)
    - QR Code
    - Japan Post 4 State Customer Code
    - EAN-13
    - EAN-8
    - Code 39
    - Code 128
    - Codabar(NW-7)
    - ITF-14

## Documentation

Please see the following page for more information

- [Developer guides(In development)](https://labelmake.jp/labelmake)
- [API Reference(In development)](https://labelmake.jp/labelmake)

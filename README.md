# d2l-pdf-viewer
[![Build Status](https://travis-ci.com/Brightspace/d2l-pdf-viewer.svg?branch=master)](https://travis-ci.com/Brightspace/d2l-pdf-viewer)



## Installation

`d2l-pdf-viewer` can be installed from [Bower][bower-url]:
```shell
bower install d2l-pdf-viewer
```

## Usage

Import `d2l-pdf-viewer`:

```js
import 'd2l-pdf-viewer/d2l-pdf-viewer.js';
```

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../d2l-typography/d2l-typography.html">
    <link rel="import" href="d2l-pdf-viewer.html">
    <custom-style include="d2l-typography">
      <style is="custom-style" include="d2l-typography"></style>
    </custom-style>
    <style>
      html {
        font-size: 20px;
        font-family: 'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
      }
    </style>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<d2l-pdf-viewer
  src="my-pdf-url"
  loader="script"
  use-cdn
  pdf-js-get-document-params="<params go here>">
</d2l-pdf-viewer>
```

### Properties

- `src`: string URI of pdf you want to dipslay
- `loader`: `"import"` for pdfjs as an es6 module, or `"script"` for non-module pdfjs
- `use-cdn`: boolean flag to use remote pdfjs libraries instead of local. Not supported for `loader="import"` (yet)
- `pdf-js-worker-src`: string URI pointing to a pdfjs worker script
- `pdf-js-get-document-params`: async getter that returns `DocumentInitParameters` (or it can be set with just a `DocumentInitParameters` object) to be passed into `getDocument`. This can contain whatever you want (eg. `httpHeaders` or `withCredentials`), but `url` will be overwritten. However, the behavior of setting any other parameter that loads PDF data other than `url` is undefined. Only use the `src` property to specify what to load. You can find the params that can be set [here](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html#~DocumentInitParameters).
- `pdfjs-base-path`: specify local folder to find pdfjs files in, if not using `use-cdn`. Overrides default of `${import.meta.url}/../node_modules/pdfjs-dist`. Not supported for `loader="import"`.

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

If you don't have it already, install the [Polymer CLI](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) globally:

```shell
npm install -g polymer-cli
```

To start a [local web server](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#serve) that hosts the demo page and tests:

```shell
polymer serve
```

To lint ([eslint](http://eslint.org/) and [Polymer lint](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#lint)):

```shell
npm run lint
```

To run unit tests locally using [Polymer test](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#tests):

```shell
npm run test:polymer:local
```

To lint AND run local unit tests:

```shell
npm test
```



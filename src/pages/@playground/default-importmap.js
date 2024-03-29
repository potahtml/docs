/**
 * ./preview/importmap.js also has the default importmap when not
 * specified.
 */

export default `{
  "comment": "If you change the reactive lib with the playground dropdown, then you dont need to change the imports here.",

  "imports": {
    "pota": "/dist/preview/standalone/standalone.no-min.js",
    "pota/jsx-runtime": "/dist/preview/standalone/standalone.no-min.js",
    "pota/router": "/dist/preview/standalone/standalone.no-min.js",
    "pota/hooks": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins/autofocus": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins/bind": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins/onClickOutside": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins/pasteTextPlain": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins/useClipboard": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins/useFullscreen": "/dist/preview/standalone/standalone.no-min.js",
    "pota/html": "/dist/preview/standalone/standalone.no-min.js",
    "pota/components": "/dist/preview/standalone/standalone.no-min.js",
    "pota/components/theme-dark": "/dist/preview/standalone/standalone.no-min.js",
    "pota/components/theme-light": "/dist/preview/standalone/standalone.no-min.js",
    "pota/components/alert": "/dist/preview/standalone/standalone.no-min.js",
    "pota/test": "/dist/preview/standalone/standalone.no-min.js",
    "x/articles/": "/pages/%40articles/"
  }
}`

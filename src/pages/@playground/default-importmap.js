/**
 * ./preview/importmap.js also has the default importmap when not
 * specified.
 */

export default `{
  // If you change the reactive lib with the playground dropdown
  // then you dont need to change the imports here
  "imports": {
    "pota": "/dist/preview/standalone/standalone.no-min.js",
    "pota/jsx-runtime": "/dist/preview/standalone/standalone.no-min.js",
    "pota/router": "/dist/preview/standalone/standalone.no-min.js",
    "pota/hooks": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins/bind": "/dist/preview/standalone/standalone.no-min.js"
  }
}`

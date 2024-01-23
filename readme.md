# eleventy-plugin-html-validate

A simple plugin that runs on the `eleventy.after` event and validates all the HTML files that were built.

This is a fork of the [original](https://github.com/matt-auckland/eleventy-plugin-html-validate) with an added feature of exiting the build when html validation fails.

You can install this version via: `npm i github:Darkle/eleventy-plugin-html-validate`

Use:

```js
// In your .eleventy.js
const eleventyHTMLValidate = require('eleventy-plugin-html-validate');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyHTMLValidate, { exitOnValidationFail: true });
}
```

Setting `exitOnValidationFail` to true will make your build exit on html validation failure.

Warning: I have no idea which versions of Eleventy this works on, when I figure it out I'll make a note here.

Powered by [html-validator](https://www.npmjs.com/package/html-validator).

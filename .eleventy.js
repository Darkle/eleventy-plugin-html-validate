const htmlValidator = require('html-validator')
const fs = require('fs');

function log(message, isError) {
  const logLabel = "11ty-plugin-html-validator: ";

  if (isError) {
    console.error(logLabel + message);
  } else {
    console.log(logLabel + message);
  }
}

async function validateHTMLFiles(buildOutput, config) {
  const htmlFilePaths = buildOutput.results.map(r => r.outputPath)
    .filter(path => path.match(/.html$/));

  for(const filePath of htmlFilePaths){
    if (fs.existsSync(filePath)) {
      const options = {
        format: 'text',
        data: fs.readFileSync(filePath, 'utf8')
      }

      const result = await htmlValidator(options)
      const pass = result.includes("The document validates according to the specified schema(s).")

      if (!pass) {
        log(filePath + ' ❌', true);
        if(config.exitOnValidationFail){
          throw new Error(result)
        }
        else {
          log(result);
        }
      }
    }
  }
  log('All your HTML passed validation! 🎉');
}

module.exports = function (eleventyConfig, config) {
  eleventyConfig.on('eleventy.after', function(buildOutput){
    const c = config ?? {exitOnValidationFail: false}
    validateHTMLFiles(buildOutput, c).catch(err => {
      throw err
    })
  });
}

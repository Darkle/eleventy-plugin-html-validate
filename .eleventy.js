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
      const result = await htmlValidator({...config.validatorOptions, data: fs.readFileSync(filePath, 'utf8')})
      if(config.validatorOptions.validator === 'WHATWG'){
        if(!result.isValid){
          log(filePath + ' ❌', true);
          if(config.exitOnValidationFail){
            throw new Error(result.errors[0].message + '\n' + result.errors[0].ruleUrl)
          }
          else {
            log(result.errors[0].message + '\n' + result.errors[0].ruleUrl);
          }          
        }
      }
      else {
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
  }
  log('All your HTML passed validation! 🎉');
}

module.exports = function (eleventyConfig, config) {
  eleventyConfig.on('eleventy.after', function(buildOutput){
    const c = config ?? {exitOnValidationFail: false}
    if(!c.validatorOptions){
      c.validatorOptions = {}
    }
    if(!c.validatorOptions.format){
      c.validatorOptions.format = 'text'
    }
    validateHTMLFiles(buildOutput, c).catch(err => {
      throw err
    })
  });
}

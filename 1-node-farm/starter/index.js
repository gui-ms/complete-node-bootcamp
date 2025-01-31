const fs = require('fs')

const textInput = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textInput);

const textOut = `Lorem Ipsum ipsis literis: ${textInput} \nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);

console.log("File written!");
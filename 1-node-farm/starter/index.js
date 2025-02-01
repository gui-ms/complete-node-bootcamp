const fs = require('fs')

//Synchronous way - blocking
/* const textInput = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textInput);

const textOut = `Lorem Ipsum ipsis literis: ${textInput} \nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);

console.log("File written!");
 */
//Asynchronous way - non-blocking
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
    console.log("Reading from file " + data);
    fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data1) => {
        console.log(data1);
        fs.readFile(`./txt/append.txt`, 'utf-8', (err, data2) => {
            console.log(data2);
            fs.writeFile(`./txt/final.txt`, `${data1} \n ${data2}`, 'utf-8', err => {
                console.log("File written!");
            } )
        })
    })
} )
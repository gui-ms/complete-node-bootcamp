const fs = require('fs');
const http = require('http');
const { json } = require('stream/consumers');
const url = require('url');

//*****************************************************
//FILES

//Synchronous way - blocking
/* const textInput = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textInput);

const textOut = `Lorem Ipsum ipsis literis: ${textInput} \nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);

console.log("File written!");
 */


//Asynchronous way - non-blocking
/* fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
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
 */

//******************************************* 
// SERVER

const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)

    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }
    return output;
}

//Top level code which is executed only once, hence we can use the synchronous version here
const templateOverview = fs.readFileSync("./templates/template-overview.html", 'utf-8')
const templateCard = fs.readFileSync("./templates/template-card.html", 'utf-8')
const templateProduct = fs.readFileSync("./templates/template-product.html", 'utf-8')

const data = fs.readFileSync("./dev-data/data.json", 'utf-8')
const dataObj = JSON.parse(data)

//This runs every time a request is made
const server = http.createServer((req, res) =>{
    const {query, pathname} = url.parse(req.url, true)

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(card => replaceTemplate(templateCard, card)).join('')
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)
    }
    else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product);
        res.end(output);
    }
    else if (pathname === '/api') {
        res.writeHead(200, {'content-type': 'application/json'})
        res.end(data)
    }
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'custom-header': 'whatever'
        })
        res.end("<h1>Page not found!</h1>")
    }
});

server.listen(8000, 'localhost', () => {
    console.log("Listening on port 8000!");
});
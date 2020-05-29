const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds');
const cats = require('../data/cats');

module.exports = (req, res) => {

    const pathname = url.parse(req.url).pathname;

    if (pathname === '/cats/add-cat' && req.method === 'GET') {
        let filepath = path.normalize(
            path.join(__dirname, '../views/addCat.html')
        )

        fs.readFile(filepath, (err, data) => {
            if(err) {
                console.log(err);
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('404 not found');
                res.end();
                return;
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } 
    else if (pathname === '/cats/add-breed' && req.method === 'GET') {
        let filepath = path.normalize(
            path.join(__dirname, '../views/addBreed.html')
        )

        fs.readFile(filepath, (err, data) => {
            if(err) {
                console.log(err);
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('404 not found');
                res.end();
                return;
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
    else {
        return true;
    }
}
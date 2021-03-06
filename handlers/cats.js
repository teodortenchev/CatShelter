const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const bodyParser = require('body-parser')
const breeds = require('../data/breeds');
const cats = require('../data/cats');

module.exports = (req, res) => {

    const pathname = url.parse(req.url).pathname;

    if (pathname === '/cats/add-cat' && req.method === 'GET') {
        let filepath = path.normalize(
            path.join(__dirname, '../views/addCat.html')
        )

        fs.readFile(filepath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 not found');
                res.end();
                return;
            }

            fs.readFile('./data/breeds.json', (err, breedsData) => {
                if (err) {
                    return err;
                }

                let breeds = JSON.parse(breedsData);
                let catBreedsPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
                let modifiedData = data.toString().replace(`{{catBreeds}}`, catBreedsPlaceholder);

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(modifiedData);
                res.end();
            });


        });
    }
    else if (pathname === '/cats/add-cat' && req.method === 'POST') {
        let form = new formidable.IncomingForm();
        form.uploadDir = './content/images/';
        form.keepExtensions = true;



        form.parse(req, (err, fields, files) => {
            if (err) {
                return err;
            }

            // let oldPath = files.upload.path;
            // let newPath = './content/images/' + files.upload.name;

            // fs.rename(oldPath, newPath, (err) => {
            //     if (err) throw err;
            //     console.log('File was uploaded successfully')
            // });



            fs.readFile('./data/cats.json', (err, data) => {
                if (err) throw err;

                let allCats = JSON.parse(data);

                allCats.push({
                    id: allCats.length + 1,
                    ...fields,
                    image: files.upload.path
                });

                let json = JSON.stringify(allCats);

                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(302, { 'Location': '/' });
                    res.end();
                });
            });
        });


    }
    else if (pathname === '/cats/add-breed' && req.method === 'GET') {
        let filepath = path.normalize(
            path.join(__dirname, '../views/addBreed.html')
        );

        fs.readFile(filepath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 not found');
                res.end();
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    }
    else if (pathname === '/cats/add-breed' && req.method === 'POST') {

        let formData = '';


        req.on('data', function (data) {
            formData += data;

            if (formData.length > 1e6) {
                req.connection.destroy();
            }
        });

        req.on('end', function () {
            let body = qs.parse(formData);

            fs.readFile('./data/breeds.json', (err, data) => {
                if (err) {
                    return err;
                }

                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);

                fs.writeFile('./data/breeds.json', json, () => console.log('Breed added successfully.'));
            });

            res.writeHead(302, { 'Location': '/' });
            res.end();
        });





    }
    else if (pathname.includes('/cats-edit') && req.method === 'GET') {
        let filepath = path.normalize(
            path.join(__dirname, '../views/editCat.html')
        );


        fs.readFile(filepath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 not found');
                res.end();
                return;
            }

            fs.readFile('./data/cats.json', (err, catsData) => {

                if (err) throw err;

                let cats = JSON.parse(catsData);

                let catId = Number(req.url.split('/')[2]);                

                let cat = cats.find(x => x.id === catId);


                //invalid ID is accessed and no cat is found with given id. Redirect to home
                if (cat === undefined) {
                    console.log('Cat not found')
                    res.writeHead(302, { 'Location': '/' });
                    res.end();
                    return;
                }


                fs.readFile('./data/breeds.json', (err, breedsData) => {
                if (err) {
                    return err;
                }

                let breeds = JSON.parse(breedsData);
                let catBreedsPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
                let modifiedData = data.toString().replace(`{{catBreeds}}`, catBreedsPlaceholder)
                    .replace(`{{name}}`, cat.name)
                    .replace(`{{description}}`, cat.description);

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(modifiedData);
                res.end();
            });
                // cat.name = "Zvezdichko";
                // console.log(cat.name);

                // cats.splice(catId - 1, 1, cat);
            });
        });
    }
    else if (pathname.includes('/cats-find-new-home') && req.method === 'GET') {

    }
    else if (pathname.includes('/cats-edit') && req.method === 'POST') {

    }
    else if (pathname.includes('/cats-find-new-home') && req.method === 'POST') {

    }
    else {
        return true;
    }
}
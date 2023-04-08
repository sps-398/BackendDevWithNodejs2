const path = require('path');
const rootDir = require('../util/path');
const fs = require('fs');

const filePath = path.join(rootDir, 'data', 'products.json');

const getAllProductsFromFile = (cb) => {
    fs.readFile(filePath, (err, fileContent) => {
        if(err) {
            return cb([]);
        }
        return cb(JSON.parse(fileContent));
    });
};

module.exports = class Product {
    constructor(title) {
        this.title=title;
    }

    save() {
        getAllProductsFromFile((products) => {
            products.push(this);

            fs.writeFile(filePath, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getAllProductsFromFile(cb);
    }
};
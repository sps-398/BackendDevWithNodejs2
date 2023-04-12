const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if(this.id) {
        const existingProductIndex = products.findIndex(p => p.id === this.id);
        let updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        })
      }
      else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(prodId, cb) {
    getProductsFromFile((products) => {
        const product = products.find(p => p.id === prodId);
        cb(product);
    });
  }

  static deleteById(prodId, cb) {
    getProductsFromFile((products) => {
      const productIndex = products.findIndex(p => p.id === prodId);
      products.splice(productIndex, 1);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
      cb();
    });
  }
};

const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addToCart(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
        let cart = { products: [], totalPrice: 0 };
        if(!err) {
            cart = JSON.parse(fileContent);
        }

        const existingProductIndex = cart.products.findIndex(p => p.id === id);
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;
        if(existingProduct) {
            updatedProduct = { ...existingProduct };
            updatedProduct.quantity += 1;
            cart.totalPrice +=  productPrice;
            cart.products[existingProductIndex] = updatedProduct;
        }
        else {
            const product = {
                id: id,
                quantity: 1
            };
            cart.products.push(product);
            cart.totalPrice += +productPrice;
        }

        fs.writeFile(p, JSON.stringify(cart), (err) => {
            console.log(err);
        });
    });
  }
};

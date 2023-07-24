const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class User {
  constructor(name, email, cart, id) {
    this.name=name;
    this.email=email;
    this.cart = cart;
    this._id=id;
  }

  save() {
    const db = getDb();
    return db
            .collection('users')
            .insertOne(this)
            .then(result => {
              console.log(result);
            })
            .catch(err => {
              console.log(err);
            })
  }

  addToCart(product) {
    const db = getDb();

    const cartProductIndex = this.cart.findIndex(cp => {
      return cp.productId.equals(product._id);
    });

    console.log(cartProductIndex);

    if(cartProductIndex >= 0) {
      const cartProduct = this.cart[cartProductIndex];
      this.cart[cartProductIndex] = ({ productId: new mongodb.ObjectId(product._id), quantity: cartProduct.quantity + 1 });
      return db
              .collection('users')
              .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: {
                cart: this.cart
              } });
    }
    this.cart.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 });
    return db
            .collection('users')
            .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: {
              cart: this.cart
            } });
  }

  static findById(userId) {
    const db = getDb();
    return db
            .collection('users')
            .findOne({ _id: new mongodb.ObjectId(userId) })
            .then(user => {
              return user;
            })
            .catch(err => {
              console.log(err);
            });
  }
}

module.exports = User;
const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
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

    if (cartProductIndex >= 0) {
      const cartProduct = this.cart[cartProductIndex];
      this.cart[cartProductIndex] = ({ productId: new mongodb.ObjectId(product._id), quantity: cartProduct.quantity + 1 });
      return db
        .collection('users')
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, {
          $set: {
            cart: this.cart
          }
        });
    }
    this.cart.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 });
    return db
      .collection('users')
      .updateOne({ _id: new mongodb.ObjectId(this._id) }, {
        $set: {
          cart: this.cart
        }
      });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.map(i => {
      return i.productId;
    });

    return db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.find(cp => {
              return cp.productId.toString() === p._id.toString();
            }).quantity
          }
        })
      });
  }

  deleteCartItem(productId) {
    const db = getDb();

    const productIndex = this.cart.findIndex(p => {
      p.productId.toString() === productId.toString();
    })

    this.cart.splice(productIndex, 1);

    return db.collection('users')
      .updateOne({ _id: new mongodb.ObjectId(this._id) }, {
        $set: {
          cart: this.cart
        }
      });
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name
          }
        };

        return db
          .collection('orders')
          .insertOne(order)
      })
      .then(result => {
        return db.collection('users')
          .updateOne({ _id: new mongodb.ObjectId(this._id) }, {
            $set: {
              cart: []
            }
          });
      })
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders')
              .find({ 'user._id': new mongodb.ObjectId(this._id)})
              .toArray();
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
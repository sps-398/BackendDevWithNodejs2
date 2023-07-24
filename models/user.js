const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class User {
  constructor(name, email) {
    this.name=name;
    this.email=email;
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

  static fetchAll() {
    const db = getDb();
    return db
            .collection('users')
            .find()
            .toArray()
            then(users => {
              return users;
            })
            .catch(err => {
              console.log(err);
            })
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
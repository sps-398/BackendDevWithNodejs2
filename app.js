const path = require('path');
const sequelize = require('./util/database');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const { mongoConnect } = require('./util/database');
const User = require('./models/user');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');

const app = express();  

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('64bdfc0906db3d3c2923bbb1')
    .then(user => {
        req.user=user;
        next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

mongoConnect(() => {
    app.listen(3000, () => {
        console.log('Listening at port 3000...');
    });
});
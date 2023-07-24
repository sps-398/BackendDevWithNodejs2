const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const User = require('./models/user');
const mongoose = require('mongoose');

const app = express();  

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
    // User.findById('64be14febb2cd311a16c500d')
    // .then(user => {
    //     console.log(user.cart.length);
    //     req.user = new User(user.name, user.email, user.cart, user._id);
    //     next();
    // })
    // .catch(err => console.log(err));
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(`mongodb+srv://sps398:CuFZvsz9hYgUXUB2@cluster0.tuxrxta.mongodb.net/shop?retryWrites=true&w=majority`)
    .then(result => {
        console.log('connected to mongodb...');
        app.listen(3000, () => {
            console.log('Listening at port 3000...');
        })
    })
    .catch(err => {
        console.log(err);
    })
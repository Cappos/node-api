const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/node-complete';


const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRouts = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("5be015596497b713fc256785").then(user => {
        req.user = user;
        next();
    }).catch(err => {
        console.log(err);
    });
});

app.use('/admin', adminRouts);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(MONGO_URI).then(() => {
    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                name: 'Bojan',
                email: 'cappors@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    });

    app.listen(3000);
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});
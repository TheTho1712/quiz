const express = require('express');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();
const port = 3000;

const route = require('./routes');
const notyfToCookie = require('./app/middlewares/notyfToCookie');


app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        helpers: require('./helpers/handlebar'),
    }),
);

app.use(
    session({
        secret: 'quiz_app_secret',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 3600000},
    }),
);

app.use(notyfToCookie);


app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    res.locals.errorMessage = req.session.errorMessage;
    res.locals.successMessage = req.session.successMessage;
    delete req.session.errorMessage;
    delete req.session.successMessage;
    next();
});


const db = require('./config/db');
const mongoose = require('./util/mongoose');

db.connect();


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

route(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
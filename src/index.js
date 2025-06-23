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
    }),
);

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
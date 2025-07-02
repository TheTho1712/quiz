const homeRouter = require('./home');
const quizRouter = require('./quiz');
const profileRouter = require('./profile');
const userAuth = require('../app/middlewares/userAuth');


function route(app) {

    app.use('/quiz', userAuth, quizRouter);
    app.use('/', profileRouter);
    app.use('/', homeRouter);
}

module.exports = route;
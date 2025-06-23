const homeRouter = require('./home');
const quizRouter = require('./quiz');

function route(app) {
    app.use('/quiz', quizRouter);
    app.use('/', homeRouter);
}

module.exports = route;
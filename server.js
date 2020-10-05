/* External Modules */
const express = require('express');
const path = require("path");
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/* Internal Modules */
const db = require('./models');
const controllers = require('./controllers');

const app = require('express')();

/* CONFIGURATION */
const PORT = 4000
app.set('view engine', 'ejs');

/* MIDDLEWARE */
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'demo',
    store: new MongoStore({
        url: 'mongodb://localhost:27017/blog-sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 60 * 24 * 7 * 2
    }
}));


const authRequired = (req, res, next) => {
    if(!req.session.currentUser) {
      return res.redirect('/login');
    }
    next();
}

/* ROUTES */

// view route
app.get('/', function(req, res){
    res.render('project/index', {user: req.session.currentUser});
});

// auth route
app.use('/', controllers.auth);

// author routes
app.use('/profile', authRequired, controllers.author);

// article routes
app.use('/articles', controllers.article);

// projects routes
app.use('/projects', controllers.project);

/* SERVER LISTENER */
app.listen(PORT, ()=> {
    console.log(`Server is live and listening at ${PORT}`)
});

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require("express-partials");
var methodOverride = require('method-override');
var routes = require('./routes/index');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("Quiz 2015"));//la semilla de encriptacion
app.use(session({
        secret: 'a secret',
        resave: false,
        saveUninitialized: true
    }
));
app.use(partials());
app.use(express.static(path.join(__dirname, 'public')));


//util para las transacciones put y delete
app.use(methodOverride('_method'));

//Middleware de auto logout
app.use(function(req,res,next){
    if(req.session.user){
        if(req.session.tiempo===null){//es decir si es la primera vez que se ejecuta la app
            req.session.tiempo=(new Date()).getTime();
        }else{
            var time= req.session.tiempo;
            var time2 = new Date().getTime();
            if((time2-time)>120000)
            {
                //res.redirect('/');
                delete req.session.user;
                req.session.tiempo=null;//se resetea el valor de tiempo para una futura sesion
            }else{//si el usuario continua haciendo algo el tiempo se actualiza con la nueva hora
                req.session.tiempo=(new Date()).getTime();
            }
        }
    }
    next();
});

//Helpers dinamicos
app.use(function(req,res,next){

    //guarda path en session.redir para despues de login, es decir si hacemos logout
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }
    //Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});

module.exports = app;

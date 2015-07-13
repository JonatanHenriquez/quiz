/**
 * Created by Jonatan on 12/07/2015.
 */

var expresss = require("express");

//MW de autorizacion de acceso HTTP restringidos si esta logueado
exports.loginRequired = function(req,res,next){
    if(req.session.user){
        next();//si esta logueado pasaria al otro mw ya se de edicion, creacion etc
    }else{
        res.redirect('/login');
    }
};

//GET /login  es el formulario de login
exports.new = function(req,res)
{
    var errors = req.session.errors || {};
    req.session.errorrs = {};
    res.render('sessions/new',{errors:errors});
};

//POST /login Crear la sesion
exports.create = function(req,res) {
    var login = req.body.login;
    var password = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login,password,function(error,user){
            if(error){
                req.session.errors = [{"message":"Se ha producido un error: "+error}];
                res.redirect("/login");
                return;
            }

            //Crea req.session.user y guardar campos id y username
            //la sesion se define por la existencia de req.session.user
            req.session.user = {id:user.id, username:user.username};
            res.redirect(new String(req.session.redir));//redireccion a path anterior a login
        }
    );
};

//DELETE /logout --Destruir sesion
exports.destroy = function(req,res){
    delete req.session.user; //borra la sesion
    res.redirect(req.session.redir);
};
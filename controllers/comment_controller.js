/**
 * Created by Jonatan on 12/07/2015.
 */

var expresss = require("express");
var models = require("../models/models.js");

//Autoload :id de comentarios
exports.load = function(req,res,next,commentId){
    models.Comment.find({
        where:{id: Number(commentId)}
    }).then(function(comment){//una vez conseguido el comment se procede a almacenarlo
        if(comment){
            req.comment = comment; //se almacena el comentario en req.comment
            next();
        }else{next(new Error("No existe commentId= "+commentId))}
    }).catch(function(error){next(error)});
};

//GET /quizes/:quizId/comment/new
//Para crear un nuevo comment se debe mandar el quizId del quiz al que pertenecera para guardarlo como su fk
exports.new = function (req, res) {
    res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};

//POST /quizes/:quizId/comment
exports.create = function (req, res) {
    //para crear el comentario se guarda el texto que se encuentra en el body y el id de la pregunta que ese esta en el query
    var comment = models.Comment.build(
        {
            texto: req.body.comment.texto,
            QuizId: req.params.quizId
        }
    );

    comment
        .validate()
        .then(
        function (err) {
            if (err) {
                res.render('comments/new.ejs', {comment: comment, quizId: req.params.quizId, errors: err.errors});
            }else{
                comment
                    .save()
                    .then(function(){res.redirect('/quizes/'+req.params.quizId)})
            }//res.redirect: Redireccion HTTP a lista de preguntas
        }
    ).catch(function(error){next(error)});
};

//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req,res){
    req.comment.publicado = true;
    req.comment.save({fields:["publicado"]}).then(function(){res.redirect('/quizes/'+req.params.quizId);})
        .catch(function (error) {next(error)});
};
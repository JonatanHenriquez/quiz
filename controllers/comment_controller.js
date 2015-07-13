/**
 * Created by Jonatan on 12/07/2015.
 */

var expresss = require("express");
var models = require("../models/models.js");

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
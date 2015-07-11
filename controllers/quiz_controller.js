/**
 * Created by Jonatan on 04/07/2015.
 * PErmite lelvar el control de todas las rutas
 */

var expresss = require("express");
var models = require("../models/models.js");

//MW de Autoload - factoriza el codigo si en el path aparece :quizId
exports.load = function (req, res, next, quizId) {
    models.Quiz.findById(quizId).then(function (quiz) {
        if (quiz) {//si se encontro el registro con quizId deseado
            req.quiz = quiz; //se precarga en la cabezera req el objeto de la BD buscado
            next(); //se pasa al mw que maneja la ruta en la que estamos
        } else {
            next(new Error('No existe quizId=' + quizId));
        }
    }).catch(function (error) {
        next(error)
    });
};


//GET /quizes EN ESTE NO SE APLICA EL AUTOLOAD SOLO EN SHOW Y ANSWER
exports.index = function (req, res) {
    models.Quiz.findAll().then(function (quizes) {
        res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }).catch(function(error){next(error)});

};

//GET /quizes/:id
exports.show = function (req, res) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
};

//GET /quizes/:id/answer
exports.answer = function (req, res) {
    var resultado = "Incorrecto";
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = "Correcto";
    }
    res.render('quizes/answer', {
            quiz: req.quiz,
            respuesta: resultado,
            errors: []
        }
    );
};

// GET /quizes/new
exports.new = function (req, res) {
    var quiz = models.Quiz.build( // crea objeto quiz
        {pregunta: "Pregunta", respuesta: "Respuesta"}
    );

    res.render('quizes/new', {quiz: quiz, errors: []});
};


// POST /quizes/create
exports.create = function (req, res) {
    var quiz = models.Quiz.build(req.body.quiz);

    quiz
        .validate()
        .then(
        function (err) {
            if (err) {
                res.render('quizes/new', {quiz: quiz, errors: err.errors});
            } else {
                quiz // save: guarda en DB campos pregunta y respuesta de quiz
                    .save({fields: ["pregunta", "respuesta"]})
                    .then(function () {res.redirect('/quizes')})
            }      // res.redirect: Redirección HTTP a lista de preguntas
        }
    ).catch(function(error){next(error)});
};

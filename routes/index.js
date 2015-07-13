var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Quiz', errors: []});
});

//Autoload de rutas con :quizId o sea cualquier ruta que contenga quizId se cargara el mw load
router.param('quizId', quizController.load); //autoload :quizId
router.param('commentId',commentController.load); //autoload :commentId

//ruta para los creditos
router.get('/authors', function (req, res) {
    res.render('authors', {title: 'Autor', errors: []});
});

//Rutas para quizes
router.get('/quizes',                           quizController.index);//Se obtienen todas las preguntas
router.get('/quizes/:quizId(\\d+)',             quizController.show);//se obtiene la pregunta con el id del url en donde con la expresion regular solo aceptara decimales
router.get('/quizes/:quizId(\\d+)/answer',      quizController.answer);
//Se instalan dos MW al finalizar uno con next se ejecuta el otro
router.get('/quizes/new',                       sessionController.loginRequired, quizController.new);
router.post('/quizes/create',                   sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',        sessionController.loginRequired, quizController.edit);//se acitvara autoload ya que lleva quizId
router.put('/quizes/:quizId(\\d+)',             sessionController.loginRequired, quizController.update);//las actualizaciones usan PUT
router.delete('/quizes/:quizId(\\d+)',          sessionController.loginRequired, quizController.destroy);//para borrar un recurso de la tabla

//Definicion de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',sessionController.loginRequired,commentController.publish);

//Definicion de rutas de sesion
router.get('/login',sessionController.new); //formulario login
router.post('/login',sessionController.create); //crear sesion
router.get('/logout',sessionController.destroy); //cerrar sesion


module.exports = router;

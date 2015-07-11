var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Quiz', errors: []});
});


//Autoload de rutas con :quizId o sea cualquier ruta que contenga quizId se cargara el mw load
router.param('quizId', quizController.load);

//Se obtienen todas las preguntas
router.get('/quizes', quizController.index);

//se obtiene la pregunta con el id del url en donde con la expresion regular solo aceptara decimales
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

router.get('/authors', function (req, res) {
    res.render('authors', {title: 'Autor', errors: []});
});

router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);

module.exports = router;

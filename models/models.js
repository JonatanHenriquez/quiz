/**
 * Created by Jonatan on 05/07/2015.
 * Permite llevar el control del modelo
 * Es el que se encarga de crear e inicializar la BD, ademas de realizar la conexion a esta
 */

var path = require('path');
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require("sequelize");

//Usar BBDD SQLite o P0strgres
var sequelize = new Sequelize(DB_name,user,pwd, {
        dialect:    protocol,
        protocol:   protocol,
        port:       port,
        host:       host,
        storage:    storage,//solo sqlite(.env)
        omitNull:   true    //solo Postgres
    }
);

//Importa la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz; //exporta la definicion de la tabla Quiz

//Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

//Se establece la relacion entre cada tabla
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Comment = Comment;//exporta la tabla Comment

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function () {
    //success(..) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function(count){
        if(count===0){//la tabla se inicializa solo si esta vacia
            Quiz.create({pregunta:"Capital de Italia",
                         respuesta:'Roma'});
            Quiz.create({pregunta:"Capital de Portugal",
                respuesta:'Lisboa'})
                .then(function(){console.log("Base de datos inicializada")});
        }
    });
});

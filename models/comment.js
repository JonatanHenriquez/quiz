/**
 * Created by Jonatan on 12/07/2015.
 */
//MOdelo de la tabla que contendra los comentarios del quiz(pregunta)

module.exports = function (sequelize, Datatypes)//se le pasa la libreria de sequelize y todos los tipos que esta maneja
{
    return sequelize.define(
        'Comment',
        {
            texto: {
                type: Datatypes.STRING,
                validate: {notEmpty: {msg: " -> Falta Comentario"}}
            },
            publicado:{
                type: Datatypes.BOOLEAN,
                defaultValue: false
            }
        }
    );
}

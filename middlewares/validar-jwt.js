const jwt = require('jsonwebtoken');
const { rest } = require('lodash');



const validarJWT = (req, res, next) => {

    // Leer el Token
    const token = req.header('x-token');
    const Usuario = require('../models/usuario');


    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
 
};

const validarADMIN_ROLE = ( req, res, bext) => {
    const uid = req.uid;
    try {
        const usuarioDB = Usuario.findById(uid);

        if ( !usuarioDB ){
            return rest.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        
        if ( usuarioDB.role !== 'ADMIN_ROLE' ){
            return rest.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para realizar esta acción'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el Administrador'
        });
    }
};

const validarADMIN_ROLEoMismoUsuario = ( req, res, bext) => {
    
    const uid = req.uid;
    const id = req.params.id;

    try {
        const usuarioDB = Usuario.findById(uid);

        if ( !usuarioDB ){
            return rest.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        
        if ( usuarioDB.role === 'ADMIN_ROLE' || uid === id ){

            next();

        } else {
            return rest.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para realizar esta acción'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el Administrador'
        });
    }
};


module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLEoMismoUsuario
};
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {
    errorHandler
} = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    //console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.login = (req, res) => {
    //Encontrar al usuario vía email
    const {
        email,
        password
    } = req.body;
    User.findOne({
        email
    }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                err: `El usuario con el email: ${email}, no existe. Por favor registrate`
            });
        }

        //En caso de que exista el usuario, habrá que validar que el email y el password coincidan con el de la base
        //Crear un método dentro del módelo para la autenticación
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'El email y/o el password no coinciden, favor de validar'
            });
        }
        //Crear un token signado con el UserId y el secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie("t", token, { expire: new Date() + 9999 });

        //Retorna la respuesta con el usuario y el token  al front 
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({message: 'Se cerro sesión correctamente'});
};


exports.requireSignin = expressJwt({
    secret: "CuautleSecret",
    userProperty: "auth"
});

exports.isAuth = (req,res, next ) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Acceso denegado'
        });
    }
    next();
}

exports.isAdmin = (req,res,next) => {
    if (req.profile.role === 0) {
        return res.status(403).json ({
            error: 'Recurso del administrador! Acceso denegado'
        });
    }
    next();
}
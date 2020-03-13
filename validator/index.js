exports.userSignupValidator = (req,res,next) => {
    req.check('name', 'El campo Nombre es requerido').notEmpty();
    req.check('name')
        .isLength({
            min: 5,
            max: 32
        })
        .withMessage('El nombre debe de tener por lo menos 5 carácteres');
    req.check('email', 'El campo email debe de tener entre y 32 carácteres')
        .matches(/.+\@.+\..+/)
        .withMessage('El email debe contener @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'El campo contraseña es obligatorio').notEmpty();
    req.check('password')
        .isLength({min: 6})
        .withMessage('La contraseña debe contener al menos 6 carácteres')
        .matches(/\d/)
        .withMessage('La contraseña debe tener por lo menos un número');

    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});

    }

    next();
};

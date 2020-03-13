const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');

//rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

//App
const app = express();

require('dotenv').config({path: '.env'});

//Conexión Base de Datos
mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useCreateIndex: true
    }
).then( () => console.log('Nos conectamos a la base de datos de Mongo'));

mongoose.connection.on('error', err => {
    console.log(`Hubo un error al conectarse a la base de datos: ${err.message}`);
});

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//Rutas
app.use("/api/", authRoutes);
app.use("/api/", userRoutes);
app.use("/api/", categoryRoutes);
app.use("/api/", productRoutes);

//Configuración servidor
 const port = process.env.PORT || 8000;

 app.listen(port, () => {
    console.log(`Estamos escuchando peticiones desde el puerto ${port}`);
 });


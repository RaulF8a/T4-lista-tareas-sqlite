const express = require('express');
const cors = require('cors');

// Instancia.
const app = express();

// Habilitar CORS
app.use(cors());

// Parser
app.use( express.json() );

// Rutas
app.get('/', (req, res) => {
    return res.status(200).send({ message: 'Hello World!' });
});

app.use( '/tasks', require('./routes/tasks') );


// Creacion del servidor.
app.listen( 3000, () => {
    console.log(`Servidor corriendo en el puerto 3000.`);
} );

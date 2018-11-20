const path = require('path');
require('dotenv').config();
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const app = express();

let server = http.createServer(app);

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/'));

let io = socketIO(server);

io.on('connection', (client) => {
    console.log('Usuario conectado');

    client.emit('sendMessage', {
        user: 'Administrador',
        message: 'Bienvenido a esta aplicación'
    });

    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    client.on('sendMessage', (message, callback) => {
        console.log(message);

        if (message.user) {
            callback({
                response: 'Todo salió bien'
            });
        } else {
            callback({
                response: 'Todo salió mal'
            });
        }
    });
});

server.listen(process.env.PORT, (error) => {

    if (error) throw new Error(error);

    // eslint-disable-next-line no-console
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}.`);
});

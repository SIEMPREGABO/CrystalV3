import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import cookie_parser from 'cookie-parser'
import projectRoutes from './routes/project.routes.js'
import { activarTareasInactivas } from './controllers/project.controller.js';
import http from 'http';
import { Server as ServerSocket } from "socket.io";

const app = express();

//settings

app.use(morgan('dev'));
app.use(express.json());
app.set('port', 4000);
app.use(cookie_parser());


//middleware

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4001'],
    credentials: true
}));


//routes

app.use("/api",authRoutes);
app.use("/api",projectRoutes);

activarTareasInactivas();

let rooms = {};
const server = http.createServer(app);
server.listen('4001');
const io = new ServerSocket(server, {

    cors: {
        origin: "http://localhost:3000"
    },
    transports: ['websocket', 'polling']
});
console.log('Ruta de socket.io en el servidor:', io.path());
const port = io.httpServer.address();
console.log('El servidor socket.io está escuchando en el puerto:', port);
console.log('Configuración de socket.io:', io.opts);
io.on("connection", socket => {
    //console.log("Cliente conectado");
    //console.log(socket.id);
    //connectedUsers[socket.id] = socket.id;
    const sala = socket.handshake.auth.sala;
    //console.log("Sala: " + socket.handshake.auth.sala);
    socket.join(`S${sala}`);

    if(!rooms[sala]){
        rooms[sala] = {};
    }

    rooms[sala][socket.id] = {
        userId: socket.handshake.auth.iduser,
    }

    io.to(`S${sala}`).emit('updateUserList', Object.values(rooms[sala]));
    //console.log(`S1`);
    socket.on('message', (data) => {
        //console.log(data);
        socket.to(`S${sala}`).emit('message', {
            data,
            from: data.from,
        });
    });
});



io.on('error', (error) => {
    console.error('Error en el servidor de socket.io:', error);
});

export default app;
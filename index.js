import express, { response } from "express";
import path from 'path';
import * as url from 'url';
import session from "express-session";
import { content } from './Services/contentServices.js'
import router from "./routes/content.js";
import userRouter from "./routes/user.js";
import passport from "passport";
import bodyParser from "body-parser";
import { chats } from "./Services/chatServices.js";
import { ChatGPTUnofficialProxyAPI } from 'chatgpt'


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = new express;

import http from 'http'
const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server, {
    cors: {

        credentials: true
    }
});

const sessionMiddleware = session({
    secret: process.env.SESION,
    resave: false,
    saveUninitialized: false
})
app.use(sessionMiddleware)


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + '/public/styles'));
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/uploads'));
app.use(express.static(__dirname + '/public/profilePhotos'));
app.use(express.static(__dirname + '/public/images'));

app.use('/a', express.static('/b'));
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", 'ejs')

app.use(function (req, res, next) {
    res.locals = {
        isAutenticated: req.isAuthenticated(),
        user: req.isAuthenticated() ? req.user : {}
    };
    next();
});



app.get("/", (req, res) => {

    const user = req.user
    content.categorys.get().then(resp => {
        res.render('home', { categorys: resp })
    })


})


app.use('/user', userRouter)

app.use('/content', router)


app.get('/chatlist', (req, res) => {
    chats.get().then(chatlist => {
        res.render('chatlist', { chats: chatlist })
    })

})

app.get('/messenger', async (req, res) => {
    const room = req.query.room
    if (!(await chats.isContains(room)) || room === undefined) {
        res.redirect('chatlist')
    } else {
        res.render('messenger')
    }

})




const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));


io.on('connection', (socket) => {
    socket.on('user connect', async (room) => {

        socket.join(room);

        const messages = await chats.messages.get(room)

        io.sockets.in(room).emit('get old messages', messages);

        socket.on('send message', (msg) => {
            if (socket.request.user === undefined) {
                return 'err'
            }

            chats.messages.create(room, socket.request.user.ID, msg);

            io.sockets.in(room).emit('get message', { msg: msg, user: socket.request.user });
        })

    })

})


server.listen(process.env.PORT)
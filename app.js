const express = require('express');
const http = require('http');
const router = require('./router');
const cors = require('cors');
const app = express();
app.use(cors());
const {adduser,removeUser,getUser,getUsersInRomm}=require('./users')

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    // console.log('New connection');

    socket.on('join', ({ name, room }, callback) => {
        // console.log(name, room);
        // Your join logic here
        // const error = true;
        // if (error) {
        //     callback({ error: 'error' });
        // }
        const {error,user}=adduser({id:socket.id,name,room})
        if(error) return callback(error)
        socket.emit('message',{user:'admin',text:`${user.name},welcome to room ${user.room}`})
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name}, has joined`})
        socket.join(user.room)
        io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRomm(user.room)})
        
        
        callback()

    });
    socket.on('sendMessage',(message,callback)=>{
        const user=getUser(socket.id);
        if(user){
        io.to(user.room).emit('message',{user:user.name,text:message});
        io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRomm(user.room)});
        callback()}
        else{
            console.log("user not found ",socket.id)
        }

    })

    socket.on('disconnect', () => {
        console.log('User has left');
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left`})
        }
        // Your disconnect logic here
    });
});

app.use(router);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

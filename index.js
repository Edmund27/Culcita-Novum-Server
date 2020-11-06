require('dotenv').config()
const express = require("express");
const loggerMiddleWare = require("morgan");
const socket = require('socket.io')
const cors = require("cors");
const { PORT } = require("./config/constants");
const Sequelize = require('sequelize');
const { Op } = require("sequelize")

const authRouter = require("./routers/auth");
const authMiddleWare = require("./auth/middleware");
const listingsRouter = require("./routers/listings")
const categoriesRouter = require("./routers/categories")

const User = require('./models').user;
const Chat = require('./models').chat;
const Message = require('./models').message;

const socketConnections = {}
const findOrCreateChat = require("./methods/chat")
const createMessage = require("./methods/message")

const cloneDeep = require('lodash.clonedeep');
const _ = require('lodash')


const app = express();

const server = app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

app.use(cors());





// Sockets: _______________________________________
const io = socket(server);
io.sockets.on('connection', async (socket) => {
  socket.on('openMessages', async email => {
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (user) {
      const users = await User.findAll({
        attributes: ['name', 'id', 'image']
      })
      const userId = user.id
      const chats = await Chat.findAll({
        where: Sequelize.or(
          { user1Id: userId },
          { user2Id: userId }
        ),
        include: [Message],
      })

      const chatsWithLastMessage = await chats.map(function (chat) {
        const lastMessage = chat.messages.length ? chat.messages[chat.messages.length - 1].text : []
        const senderId = chat.messages.length ? chat.messages[chat.messages.length - 1].senderId : null

        return {
          user1Id: chat.user1Id,
          user2Id: chat.user2Id,
          senderId: senderId,
          message: lastMessage
        }
      });

      const usersWithMessage = users.map(user => {
        const chatsWithMessage = chatsWithLastMessage.find(chat => user.id == chat.user1Id || user.id == chat.user2Id)
        user.dataValues.chat = chatsWithMessage ? chatsWithMessage : null
        return user;
      })
      socket.emit('usersData', usersWithMessage)
      socketConnections[user.id] = socket.id;
      io.emit('updatedOnlineUsers', socketConnections);

    }
  })

  socket.on('chat', async users => {
    const chat = await findOrCreateChat(users.user.id, users.receiver.id)
    if (chat.dataValues.messages) {
      socket.emit('pastMessages', chat.dataValues.messages)
    } else {
      socket.emit('pastMessages', [])
    }
  })

  console.log(`connection established via id: ${socket.id}`)
  socket.on('newMessage', async messageObject => {

    const { user, receiver, text } = messageObject
    const message = await createMessage(user.id, receiver.id, text)

    const emittingMessage = { ...message.dataValues, receiverId: receiver.id }
    socket.emit('incomingMessage', emittingMessage)
    const receiverSocketId = socketConnections[receiver.id]
    socket.to(receiverSocketId).emit('incomingMessage', emittingMessage)
  })

  socket.on('disconnect', () => {
    function deleteBySocketId(socketId) {
      for (var userId in socketConnections) {
        if (socketConnections[userId] == socketId) {
          delete socketConnections[userId];
        }
      }
    }
    deleteBySocketId(socket.id)
    io.emit('updatedOnlineUsers', socketConnections);
  });
})
//Sockets end_________________________________________________

app.use(loggerMiddleWare("dev"));
const bodyParserMiddleWare = express.json();
app.use(bodyParserMiddleWare);


if (process.env.DELAY) {
  app.use((req, res, next) => {
    setTimeout(() => next(), parseInt(process.env.DELAY));
  });
}


app.get("/", (req, res) => {
  res.send("Hi from express");
});

app.post("/echo", (req, res) => {
  res.json({
    youPosted: {
      ...req.body,
    },
  });
});

app.post("/authorized_post_request", authMiddleWare, (req, res) => {
  const user = req.user;
  delete user.dataValues["password"];

  res.json({
    youPosted: {
      ...req.body,
    },
    userFoundWithToken: {
      ...user.dataValues,
    },
  });
});

//ROUTERS:________________________________
app.use("/", authRouter);
app.use("/listings", listingsRouter)
app.use("/categories", categoriesRouter)
//________________________________________


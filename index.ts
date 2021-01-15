import * as express from 'express'
import * as http from 'http'
import * as session from 'express-session'
import * as cookieParser from 'cookie-parser'
import * as io from 'socket.io'


// import routers
import { root, auth } from './routes/index'

var app = express()                   // generate express object
var server = http.createServer(app)   // create http server by express object
var socket = new io.Server(server)    // generate socket object

// use ejs as view engine
app.set('view engine', 'ejs')


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static(__dirname + '/public'))

// do declaration merging for express-session
declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}
app.use(session({
  name: 'user_id',
  secret: 'mashuSecret',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 600000
  }
}))

app.use('/', root)
app.use('/auth', auth)


declare module NodeJS {
  export interface Global {
    users: any[],
    userMessages: any
  }
}
declare const global: NodeJS.Global

global.users = []
global.userMessages = {}
socket.use((socket, next) => {
  var query: any = socket.handshake.query
  var token = query.username

  if (token) {
    next()
  }
  
  return next(new Error('authentication error'))
})

socket.on('connection', (client: SocketIO.Socket) => {
  var username = client.handshake.query.username

  client.on('disconnect', () => {
    var clientId = client.id
    for (var i = 0; i < global.users.length; i++) {
      if (global.users[i].id && global.users[i].id == clientId) {
        global.users.splice(i, 1);
        break;
      }
    }
  })

  global.users.push({
    id: client.id,
    name: username
  })

  client.on('message', function(data) {
    console.log('收到!')
    console.log(data)
    socket.emit('message', data)
  })

  socket.emit('newUser', {
    id: client.id,
    name: username
  })
})

server.listen('10001', () => {
  console.log('server started!')
})
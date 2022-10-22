import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { MongoClient } from 'mongodb'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const donationsdb = client.db('donations')
const events = donationsdb.collection('events')
const users = donationsdb.collection('users')
client.connect()
console.log('Connected to MongoDB.')

const PORT = 4001
app.listen(PORT, () => console.log(`Port is live on ${PORT}.`))

// Hello world
// app.get('/helloworld', async (request, response) => {
//   const allEvents = await events.find().toArray()
//   response.status(200).json({
//     status: 200,
//     apiData: `<h1>Hello World !</h1>` ,
//     message: 'Hello world message',
//   })
// })

// GET
app.get('/', async (request, response) => {
  const allEvents = await events.find().toArray()
  response.status(200).json({
    status: 200,
    apiData: allEvents,
    message: 'All events.',
  })
})

// POST (Add)
app.post('/', async (request, response) => {
  const addEvent = await events.insertOne(request.body)
  response.status(201).json({
    status: 200,
    apiData: addEvent,
    message: 'Event added.'
  })
})

// PUT (Update)
app.put('/', async (request, response) => {
  const updateEvent = await events.findOneAndUpdate(request.query, {$set: request.body})
  response.status(201).json({
    status: 200,
    apiData: updateEvent,
    message: 'Event updated.'
  })
})

// DELETE
app.delete('/', async (request, response) => {
  const deleteEvent = await events.findOneAndDelete(request.query)
  response.status(200).json({
    status: 200,
    apiData: deleteEvent,
    message: 'Event deleted.'
  })
})


// SIGN UP (POST - add)
app.post('/signup', async (request, response) => {
  const newUser = {email: request.body.email, password: request.body.password}
  const hashedPW = await bcrypt.hash(newUser.password, 10)
  users.insertOne({email: request.body.email, password: hashedPW})
  response.status(201).send('User added to db.')
})

// LOGIN (POST - add)
app.post('/login', async (request, response) => {
  const user = await users.findOne({email: request.body.email})
  const accessGranted = await bcrypt.compare(request.body.password, user.password)
  
  if(accessGranted){
    const accessToken = jwt.sign(user, process.env.PRIVATE_KEY)
    response.status(200).send({accessToken: accessToken})
  } else {
    response.send('No user found or invalid password.')
  }
})

app.get('/allusers', async (request, response) => {
  const token = request.headers.authorization && request.headers.authorization.split(' ')[1]
  console.log(token)
  jwt.verify(token, process.env.PRIVATE_KEY, async (error, decoded) => {
    console.log(decoded)
    if(decoded) {
      const totalUserList = await users.find().toArray()
      response.status(200).send(totalUserList)
    } else if (error){
      response.send(401).json({error: 'Token not valid. Must have valid token.'})
    }
  })
})
import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const donationsdb = client.db('donations')
const events = donationsdb.collection('events')
client.connect()
console.log('Connected to MongoDB.')

const PORT = 4001
app.listen(PORT, () => console.log(`Port is live on ${PORT}.`))


// // GET
// app.get('/', async (request, response) => {
//   const allEvents = await events.find().toArray()
//   response.send(allEvents)
// })


// // POST (Add)
// app.post('/', async (request, response) => {
//   await events.insertOne(request.body)
//   response.send('Event added to database.')
// })

// // PUT (Update)
// app.put('/', async (request, response) => {
//   await events.findOneAndUpdate(request.query, {$set: request.body})
//   response.json('Event updated in database.')
// })

// // DELETE
// app.delete('/', async (request, response) => {
//   await events.findOneAndDelete(request.query)
//   response.send('Event deleted from database.')
// })
// Hello world
app.get('/helloworld', async (request, response) => {
  const allEvents = await events.find().toArray()
  response.status(200).json({
    status: 200,
    apiData: `<h1>Hello World !</h1>` ,
    message: 'Hello world message',
  })
})

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

// // PUT (Update)
app.put('/', async (request, response) => {
  const updateEvent = await events.findOneAndUpdate(request.query, {$set: request.body})
  response.status(201).json({
    status: 200,
    apiData: updateEvent,
    message: 'Event updated.'
  })
})

// // DELETE
app.delete('/', async (request, response) => {
  const deleteEvent = await events.findOneAndDelete(request.query)
  response.status(200).json({
    status: 200,
    apiData: deleteEvent,
    message: 'Event deleted.'
  })
})
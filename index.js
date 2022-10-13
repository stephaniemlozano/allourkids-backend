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


// GET
app.get('/', async (request, response) => {
  const allEvents = await events.find().toArray()
  response.status(200).json({
    status: 200,
    data: allEvents,
    message: 'All events.',
  })
})

// app.get('/helloworld', async (request, response) => {
//   response.status(200).json({
//     status: 200,
//     data: '<h1>hello world</h1>',
//     message: `All events.`,
//   })
// })

// POST (Add)
app.post('/', async (request, response) => {
  const addEvent = await events.insertOne(request.body)
  response.status(201).json({
    status: 200,
    data: addEvent,
    message: 'Event added.'
  })
})

// // PUT (Update)
app.put('/', async (request, response) => {
  const updateEvent = await events.findOneAndUpdate(request.query, {$set: request.body})
  response.status(201).json({
    status: 200,
    data: updateEvent,
    message: 'Event updated.'
  })
})

// // DELETE
app.delete('/', async (request, response) => {
  const deleteEvent = await events.findOneAndDelete(request.query)
  response.status(200).json({
    status: 200,
    data: deleteEvent,
    message: 'Event deleted.'
  })
})


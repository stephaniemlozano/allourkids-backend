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

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Port is live on ${PORT}.`))


// GET
app.get('/', async (request, response) => {
  const allEvents = await events.find().toArray()
  response.send(allEvents)
})

app.get('/helloworld', async (request, response) => {
  response.send('<h1>hello world</h1>')
})

// POST (Add)
app.post('/', async (request, response) => {
  await events.insertOne(request.body)
  response.send('Item added to Events.')
})

// PUT (Update)
app.put('/', async (request, response) => {
  await events.findOneAndUpdate(request.query, {$set: request.body})
  response.send('Item updated.')
})

// DELETE
app.delete('/', async (request, response) => {
  await events.findOneAndDelete(request.query)
  response.send('Item deleted from Events.')
})
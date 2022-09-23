import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const allourkidsdb = client.db('allourkids')
const circuits = allourkidsdb.collection('circuits')
client.connect()
console.log('Connected to MongoDB.')

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Port is live on ${PORT}.`))


// GET
app.get('/', async (request, response) => {
  const allItems = await circuits.find().toArray()
  response.send(allItems)
})

// POST (Add)
app.post('/', async (request, response) => {
  await circuits.insertOne(request.body)
  response.send('Item added to Circuits.')
})

// PUT (Update)
app.put('/', async (request, response) => {
  await circuits.findOneAndUpdate(request.query, {$set: request.body})
  response.send('Item updated.')
})

// DELETE
app.delete('/', async (request, response) => {
  await circuits.findOneAndDelete(request.query)
  response.send('Item deleted from Circuits.')
})
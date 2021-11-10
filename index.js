const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000
const { MongoClient } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h5pr3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("fancyBikes");
      const bikesCollection = database.collection("bikes");

      //post bikes
      app.post("/bikes", async (req, res) => {
          const bike = req.body;
          const result = await bikesCollection.insertOne(bike);
          res.json(result);
      })

      //get bikes
      app.get('/bikes', async (req, res) => {
          const bikes =  bikesCollection.find({});
          const result = await bikes.toArray();
          res.json(result);
      })

    } 
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Fancy Bikes!')
})

app.listen(port, () => {
  console.log(`Listening to port:${port}`)
})
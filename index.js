const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;

const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h5pr3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("fancyBikes");
      const bikesCollection = database.collection("bikes");
      const ordersCollection = database.collection("orders");
      const reviewsCollection = database.collection("reviews");
      const usersCollection = database.collection("users");

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

      //get single bike through id
      app.get('/bikes/:id', async (req, res) => {
        const id = req.params.id;
        const query = ({_id: ObjectId(id)});
        const result = await bikesCollection.findOne(query);
        res.json(result);
      })

      //post bike order
      app.post('/orders', async (req, res) => {
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.json(result)
      })

      //get a single user orders
      app.get('/orders/:email', async (req, res) => {
        const email = req.params.email;
        const query ={email: email};
        const cursor = ordersCollection.find(query);
        const result = await cursor.toArray();
        res.json(result);
      })

      //delete a user order from user
      app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await ordersCollection.deleteOne(query);
        res.json(result);
      })

      //post review
      app.post('/review', async (req, res) => {
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.json(result);
      })

      //get reviews
      app.get('/review', async (req, res) => {
        const cursor = reviewsCollection.find({});
        const result = await cursor.toArray();
        res.send(result)
      })

      //get all orders
      app.get('/orders', async (req, res) => {
        const cursor = ordersCollection.find({});
        const result = await cursor.toArray();
        res.send(result)
      })

      //update order status by admin
      app.put('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: ObjectId(id)};
        const updateDoc = {
          $set: {
            orderStatus: 'shipped'
          },
        }
        const result = await ordersCollection.updateOne(filter, updateDoc)
        res.send(result)
      })

      //post users
      app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result)
      })

      //make a user admin
      app.put('/users/:email', async (req, res) => {
        const email = req.params.email;
        const filter = {email: email};
        const updateDoc = {
          $set: {
            role: 'admin'
          },
        };
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.json(result)
      })

      //get admin
      app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = {email: email};
        const result = await usersCollection.findOne(query);
        if(result?.role === 'admin'){
          res.json(1)
        }
        else{
          res.json(0)
        }
      })

      //delete a bike by admin
      app.delete('/bikes/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await bikesCollection.deleteOne(query);
        res.json(result);
        console.log(id)
      })

    } 
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app=express()
const port=process.env.PORT || 5000

app.use(cors())
app.use(express.json())









const uri = `mongodb+srv://${process.env.DB_FREELANCER_USER}:${process.env.DB_FREELANCER_PASSWORD}@brainbazzdatabase.ihuzu7m.mongodb.net/?retryWrites=true&w=majority&appName=BrainBazzDatabase`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const taskCollection = client.db("jobPondDB").collection("tasks");

    //get data on db
    app.get("/tasks", async (req, res) => {
      const cursor = taskCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/tasks/:id',async(req,res)=>{
      const id =req.params.id
      const query={_id: new ObjectId(id)}
      const result=await taskCollection.findOne(query)
      res.send(result)
    })

    //post the task data
    app.post("/tasks", async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    });

    //delete the on db
    app.delete('/tasks/:id',async(req,res)=>{
      const id =req.params.id
      const query={_id: new ObjectId(id)}
      const result= await taskCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











app.get('/',(req,res)=>{
  res.send('Freelancer server in running')
})

app.listen(port,()=>{
  console.log(`Freelancer server port ${port}`);
})
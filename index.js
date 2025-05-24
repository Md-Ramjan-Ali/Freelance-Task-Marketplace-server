const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
    const taskCollection = client.db("jobPondDB").collection("tasks");

    //get data on db
    app.get("/tasks", async (req, res) => {
      const cursor = taskCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //feature task data condition
    app.get("/tasks/featuretasks", async (req, res) => {
      const result = await taskCollection
        .find()
        .sort({ deadline: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    //post the task data
    app.post("/tasks", async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    });

    //update db
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateTask = req.body;

      const updateDoc = {
        $set: updateTask,
      };

      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //new data set and set data in db
    app.patch("/tasks/:id/bid", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const incBid = {
        $inc: {
          bidsCount: 1,
        },
      };

      const result = await taskCollection.updateOne(filter, incBid);
      res.send(result);
    });

    //delete the on db
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Freelancer server in running");
});

app.listen(port, () => {
  console.log(`Freelancer server port ${port}`);
});

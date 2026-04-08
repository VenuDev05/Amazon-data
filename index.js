const express = require('express')
const app = express()
const port = 5001
const cors = require('cors')


app.use(cors())
app.use(express.json())

app.use(cors({
  origin: "https://amazon-eight-ruby.vercel.app",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

app.options("*", cors());

app.get('/', (req, res) => {
  res.send('Welcome to backend!!!')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://DatabaseUser:data123@cluster0.u2mt6b8.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const infoCollection = client.db("informationCenter").collection("info")

    app.post("/send", async (req, res) => {
      const pushData = req.body
      const pushResult = await infoCollection.insertOne(pushData)
      res.send(pushResult)
    })

    app.get("/receive", async (req, res) => {
      const getData = infoCollection.find()
      const getResult = await getData.toArray()
      res.send(getResult)
    })

    app.get("/list/:id", async (req, res) => {
      const filterId = req.params.id
      const filterData = { _id: new ObjectId(filterId) }
      const filterResult = await infoCollection.findOne(filterData)
      res.send(filterResult)
    })

    app.patch("/update/:id", async (req, res) => {
      const updateId = req.params.id
      const updateData = req.body
      const updateFilter = { _id: new ObjectId(updateId) }

      const updateDoc = {
        $set: {
          ...updateData
        },
      }
      const options = { upsert: true }
      const updateResult = await infoCollection.updateOne(updateFilter, updateDoc, options)
      res.send(updateResult)
    })

    app.delete("/delete/:id", async (req, res) => {
      const deleteId = req.params.id
      const deleteFilter = { _id: new ObjectId(deleteId) }
      const deleteResult = await infoCollection.deleteOne(deleteFilter)
      res.status(200).json({ success: true, message: "ellam pochi poo", deleteResult })
    })

    const mobData = client.db("informationCenter").collection("mobileData")

    app.post("/mobDataSend", async (req, res) => {
      const pushData = req.body
      const pushResult = await mobData.insertOne(pushData)
      res.send(pushResult)
    })


    app.get("/mobDataReceive", async (req, res) => {
      const getData = mobData.find()
      const getResult = await getData.toArray()
      res.send(getResult)
    })

    app.get("/mobDataList/:id", async (req, res) => {
      const filterId = req.params.id
      const filterData = { _id: new ObjectId(filterId) }
      const filterResult = await mobData.findOne(filterData)
      res.send(filterResult)
    })

    app.patch("/mobDataUpdate/:id", async (req, res) => {
      const updateId = req.params.id
      const updateData = req.body
      const updateFilter = { _id: new ObjectId(updateId) }

      const updateDoc = {
        $set: {
          ...updateData
        },
      }
      const options = { upsert: true }
      const updateResult = await mobData.updateOne(updateFilter, updateDoc, options)
      res.send(updateResult)
    })

    app.delete("/mobDataDelete/:id", async (req, res) => {
      const deleteId = req.params.id
      const deleteFilter = { _id: new ObjectId(deleteId) }
      const deleteResult = await mobData.deleteOne(deleteFilter)
      res.status(200).json({ success: true, message: "ellam pochi poo", deleteResult })
    })

    await client.db("admin").command({ ping: 1 });
    console.log("You just connected, when you are going to work?");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Listen panitu tha irukan ${port}`)
})


const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 80
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_ADMIN}:${process.env.MONGO_PASS}@cluster0.d7awh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const cors = require('cors');
app.use(cors())
app.use(express.json())

async function run() {
    try {
        client.connect()
        const loginDB = client.db("loginDB").collection("credentials");
        app.get('/login', async (req, res) => {
            const result = await loginDB.find().toArray();
            res.send(result)
        })
        app.post('/register', async (req, res) => {
            if (!req.body) return res.send({ message: "Invalid Req" });
            const { email } = req.body
            const existingUser = await loginDB.findOne({ email })
            if (existingUser) return res.status(409).send({ conflict: 'User Already Exists ' })
            const result = await loginDB.insertOne(req.body);
            res.send(result)
        })
        app.post('/login', async (req, res) => {
            console.log(req.body.email)
            const { email, pass } = req.body
            if (!req.body) return { message: "Invalid Req" };
            const result = await loginDB.findOne({ email, pass });
            res.send(result)
        })
    } catch {
        (console.dir);
    }
}
run()
app.listen(port)
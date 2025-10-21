require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9x5iie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const plantCollection = client.db('plantDB').collection('plants');


        app.get('/plants', async (req, res) => {
            const result = await plantCollection.find().toArray(); //Fetching all plant data from database
            res.send(result); //Sending fetched data to client
        })

        app.get('/plants/:id', async (req, res) => {
            const id = req.params.id; // Getting id from request parameters
            const query = { _id: new ObjectId(id) }; // Converting string id into mongodb object id
            const result = await plantCollection.findOne(query); // Commanding to find the plant with specific id and store here
            res.send(result); //Sending fetched data to client
        })

        app.get('/userPlants/:email', async (req, res) => {
            const email = req.params.email; //  Getting the email from request parameters
            const plantCollection = client.db('plantDB').collection('plants'); // Huddai
            const result = await plantCollection.find({ email }).toArray(); // commanding to find all plants with specific email and store here
            res.send(result); // Sending fetched data to client
        })


        app.post('/plants', async (req, res) => {
            const newPlant = req.body;
            console.log(newPlant);
            const result = await plantCollection.insertOne(newPlant) //Inserting newPlant data into database and storing insertedId in here
            res.send(result) // Sending confirmation and insertedId back to client
        });

        app.put('/plants/:id', async (req, res) => {
            const id = req.params.id; // Getting id from the request parameters
            const filter = { _id: new ObjectId(id) } // Converting string id into mongodb object id
            const options = { upsert: true }; // Emny
            const updatedPlant = req.body; // Getting updated plant data from the request body
            const updatedDoc = {
                $set: updatedPlant
            }

            const result = await plantCollection.updateOne(filter, updatedDoc, options) // Commanding to update the plant with specific id with the updatedPlant data
            res.send(result) //  Sending the update confirmation to the client
        })

        app.delete('/plants/:id', async (req, res) => {
            const id = req.params.id; // Getting id from request parameters
            const query = { _id: new ObjectId(id) }; //Converting string id into mongodb object id
            const result = await plantCollection.deleteOne(query); //Commanding to delete the plant with specific id and store the confirmation here...
            res.send(result); // Sending the delete confirmation to the client 
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


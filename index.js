const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//use middleware//
app.use(cors());
app.use(express.json());

// user:todo-app
// pass:BueIOm3XMOzZ8jCk
const uri = "mongodb+srv://todo-app:BueIOm3XMOzZ8jCk@cluster0.wyluv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {

    try {
        await client.connect();
        const taskCollection = client.db('ToDo-App').collection('ToDoTask');
        console.log('connected to db successfully');


        //get api for a user's added todo

        app.get("/user-todo", async (req, res) => {
            const email=req.query.email;
            const query = {email};
            const cursor = taskCollection.find(query);
            const result = await cursor.toArray();
            console.log(query);
            res.send(result);
        })
        


        //create/POST notes api
        // http://localhost:5000/product
        
        
        app.post("/add-todo", async (req, res) => {
            const data = req.body;
            console.log('getting data', data);
            const result = await taskCollection.insertOne(data);
            res.send(result);

        })

        // update notes api
        // http://localhost:5000/product/62754395b1c6026d9cb9ce66
        app.put('/todo/:id',async(req,res)=>{
            const id = req.params.id;
            const data = req.body;
            console.log('from update api',data);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    // userName: data.userName,
                    // textData: data.textData,
                    ...data
                },
              };
              const result = await taskCollection.updateOne(filter, updateDoc, options);

            console.log('from put method', id);
            res.send(result);
        })




        //delete notes api
        // http://localhost:5000/inventory/62754395b1c6026d9cb9ce66
        app.delete('/todo/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const result = await taskCollection.deleteOne(filter)
            res.send(result);
        })

    }

    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my node CRUD server')
});

app.listen(port, () => {
    console.log('CRUD server is running at', port);
})
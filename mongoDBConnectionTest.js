const { MongoClient, ServerApiVersion } = require('mongodb');  //require model and get the MongoClient class

//STEP A: you will replace the following URI with YOUR connection string from MongoDB Atlas (go to the web console to find this
const uri = "mongodb+srv://jrenati:uKmNSh8g3mJrgQGH@shoppingsite.0pthyyx.mongodb.net/?retryWrites=true&w=majority&appName=shoppingsite";

//STEP B:  Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



//STEP C: THIS IS the main asynchrounous function that will run.  It need to be asynchrounous
//  as you do not know how long it will take to run.

async function run() {
    try {  //there can be exceptions with connections and you need to handle them.  I.E. the database server down

        // STEP D: Connect the client to the server (optional starting in v4.7) 
        await client.connect();    //note that await is needed when you need the system to wait for it to finish
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });   //another command here that you must do await
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


        // I have a database called shoppingsite and in it a collections called customers I will access.
        var db0 = client.db("shoppingsite");  
        console.log("got shopping site");
        console.log("db0" + db0.toString());
        var collection =  db0.collection("customers");
        console.log("collection is "+ collection.collectionName);
        console.log(" # documents in it " + await collection.countDocuments());

         // STEP E: Get the first document using findOne (you can pass a query to findOne)
        //see documentation for findOne https://www.w3schools.com/nodejs/nodejs_mongodb_find.asp
        var results =  await collection.findOne({});
        console.log('grabbed 1st customers');
        console.log(" entire 1st document" );
        console.log(results);

         // STEP F: Get "ALL" of the documents in the collection
        //now grab ALL the documents in the collection
        //see documentation for find which returns a curson https://www.w3schools.com/nodejs/nodejs_mongodb_query.asp
        //the cursor will only hold a maximum of batch size elements at any given time if batch size is specified
        // otherwise it will hold all of the documents up to what the memory will allow.
        const cursor = collection.find({});
        console.log("ALL Documents");
        for await (const doc of cursor) {
            console.log(doc);
        }

         // STEP G: Cycle through the Cursor using forEach command
        //now using the cursor grab each one of the documents.   Note cursor.rewind() makes sure
        // you are at the start of the cursor documents
        console.log("USING Cursor");
        await cursor.rewind();
        // Execute forEach command, triggers for each document
        // see https://www.mongodb.com/docs/manual/reference/method/cursor.forEach/
        await cursor.forEach( function( myDoc ) {
           console.log(myDoc)
        } );


        // STEP H: Cycle through the toArray Array results using for loop
        //here I am returning an array rather than a cursor
        //AGAIN it will only retrieve as many documents as can fit in memory.
        var arrayValues = await collection.find({}).toArray();
        console.log("ALL Document using Array")
        for(i=0; i<arrayValues.length; i++)
            console.log(arrayValues[i]);
        //for()
        //console.log(arrayValues);


        




        // STEP I: Working on INSERTION and UPDATE
        //grab the songs collection
        var songsCollection =  db0.collection('songs');
        // Create seed data -- it is in JSON format
        var seedData = [
            {
                decade: '1970s',
                artist: 'Debby  Boone',
                song: 'You Light  Up My Life',
                weeksAtOne: 10
            },
            {
                decade: '1980s',
                artist: 'Olivia  Newton-John',
                song: 'Physical',
                weeksAtOne: 10
            },
            {
                decade: '1990s',
                artist: 'Mariah  Carey',
                song: 'One Sweet Day',
                weeksAtOne: 16
            }
        ];



        //INSERT: insert the songs document into the collection, and follow this by an update
        // Note that the  insert method can take either an array or a dict.
        // will use insertMany -https://www.mongodb.com/docs/current/tutorial/insert-documents/#insert-multiple-documents
        // and pass our array of JSON objects in seedData
        //NOTE you can also insert just one document at a time too.
        // with insertOne -https://www.mongodb.com/docs/current/tutorial/insert-documents/
        // also see https://www.mongodb.com/docs/v6.2/reference/method/db.collection.insertOne/
        console.log("Insert Songs into songs collection");
        await songsCollection.insertMany(seedData);

        console.log("Insert a single song into songs collection");
        await songsCollection.insertOne({"decade": "2023s", "artist": "Billie Eilish", "song": "What Was I Made For?","weeksAtOne": 10});


        // STEP J: UPDATE:  update documents
        // you can updateOne or updateMany
        // see https://www.mongodb.com/docs/current/tutorial/update-documents/
        // Also see https://www.mongodb.com/docs/manual/reference/operator/update/
        // to read about the $set update operator and other update operators like rename, etc
        console.log("UPDATING song 'One Sweet Day' to change the artist");

        await songsCollection.updateMany(
            { song: 'One Sweet Day' },
            { $set: {  artist: 'Mariah Carey ft. Boyz II Men' } });

        /* Note here is an example where you are changing multiple fields of the document
        await db.collection('inventory').updateOne(
            { item: 'paper' },
            {
                $set: { 'size.uom': 'cm', status: 'P' },
                $currentDate: { lastModified: true }
            }
        );
        */




    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}


// STEP K: NOW RUN the above defined asynchrounous run function
run().catch(console.dir);
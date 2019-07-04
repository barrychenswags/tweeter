"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const Mongo = require('mongodb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// The in-memory database of tweets. It's a basic object with an array in it.
//const db = require("./lib/in-memory-db");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

let db = null;

// Establish connection to the mongo db and assign the mongoDb object to db
MongoClient.connect(MONGODB_URI, (err, mongoDb) => {
  if (err) {
    console.log('Cannot connect to MongoDB:', err);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  db = mongoDb;
});

// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:
const DataHelpers = require("./lib/data-helpers.js")(db);
const CreateUser = require("./lib/util/user-helper.js");
// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.
//const tweetsRoutes = require("./routes/tweets")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:
//app.use("/tweets", tweetsRoutes);



app.get('/tweets', (req, res) => {
  db.collection('tweets')
    .find()
    .toArray()
    .then(data => res.json(data))
    .catch(err => {
      console.log('Error:', err);
      process.exit(1);
    });
});

app.post('/tweets', (req, res) => {
  // extract the content from the body of the request
  console.log(req.body);
  console.log(CreateUser.generateRandomUser())
  const { tweetContent } = req.body;
  var timeInMs = Date.now();

  // save the quote in the database
  db.collection('tweets').insertOne({
    user: {
      name: CreateUser.generateRandomUser().name,
      avatars: {
        small:   CreateUser.generateRandomUser().avatars.small,
      },
      handle: CreateUser.generateRandomUser().handle
    },
    content: {
      text: tweetContent
    },
    created_at: timeInMs
  })
    .then(result => {
      // result.ops[0]._id gets us the id that has been created in the db
      console.log(result.ops[0]._id);
      // sending back the new quote
      res.send({
        _id: result.ops[0]._id,
        user:{
          name: CreateUser.generateRandomUser().name,
          avatars: {
            small:   CreateUser.generateRandomUser().avatars.small,
          },
          handle: CreateUser.generateRandomUser().handle
        },
        content: {
          text: tweetContent
        },
        created_at: timeInMs
      });
    })
    .catch(err => console.log('Error:', err));
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

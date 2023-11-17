const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const methodOverride = require('method-override')


var db

const url = "mongodb+srv://cassandramanotham:D4F3xVY4TW2IFAuW@cluster0.jio6gtb.mongodb.net/?retryWrites=true&w=majority";
const dbName = "Habit-Counter";

app.listen(1111, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(methodOverride('_method')) // ability to submit forms as updates/puts

//async GET func; get array of obj from db, then render ejs using data
app.get('/', (req, res) => {
  db.collection('Habits').find().sort({timeStamp: - 1}).toArray()
  .then(data => {
    res.render('index.ejs', { info : data })
  })
  .catch(error => console.error(error))
})

//post operation; post route = form action
app.post('/habit', (req, res) => {
  console.log(req)
  db.collection('Habits').insertOne({habit: req.body.habit, done: 0})
  .then(result => {
    console.log('Habit Added')
    res.redirect('/')
  })
  .catch(error => console.error(error))
})

//update operation for amount of times habit completed
app.put('/habit', (req, res) => {
  db.collection('Habits')
  .findOneAndUpdate({habit: req.body.habit.trim()}, {
    $set: {
      done: req.body.done +1,
      timeStamp: new Date(),
      // updatedDate: new Date()
    }
  }, {
    sort: {_id: -1},
    upsert: true 
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

//delete operation; go to habit route and Habits collection, find obj with habit and delete
app.delete('/habit', (req, res) => {
  console.log(`${req.body} This is a message`)
  db.collection('Habits').findOneAndDelete({habit: req.body.habit.trim()}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

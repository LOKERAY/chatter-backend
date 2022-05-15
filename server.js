//importing
import express from 'express'
import mongoose from 'mongoose'
import dbMessages from './dbMessages.js';
import Pusher from "pusher";
//app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1408168",
    key: "7b337c588fed1443774c",
    secret: "e5726532b63d115003cc",
    cluster: "ap2",
    useTLS: true
  });

//middleware
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
});

//DB config
const connection_url = 'mongodb+srv://prathik:idiotduffer@cluster0.lap6d.mongodb.net/chatterdb?retryWrites=true&w=majority'

mongoose.connect(connection_url)
useCreateIndex:true;
useNewUrlParser: true;
useUnifiedTopology: true

// ????

const db = mongoose.connection

db.once('open',()=>{
    console.log("DB connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change',(change) => {
        console.log("changed", change);

        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',
            {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received :messageDetails.received,
            }
            );

        }
        else{
            console.log('Error triggering Pusher');
        }
    })
})

// api routes
app.get('/',(req,res)=>res.status(200).send('hello world'));

app.get('/messages/sync', (req, res) => {
    dbMessages.find((err, data) => {
        if(err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(data);
        }
    })
})

app.post('/messages/new',(req, res) => {
    const dbMessage = req.body
    dbMessages.create(dbMessage, (err,data) => {
        if(err) {
            res.status(500).send(err)
        }
        else{
            res.status(201).send(data)
        }
    })
})


// listen

app.listen(port,()=> console.log(`Listening on Local Host: ${port} `))
//const Sentry = import("@sentry/node");
// or use es6 import statements
 import * as Sentry from '@sentry/node';

//const Tracing =import("@sentry/tracing");
// or use es6 import statements
 import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: "https://a843f3fe87e14cc58c2f30f6892b6fab@o1247451.ingest.sentry.io/6407431",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);

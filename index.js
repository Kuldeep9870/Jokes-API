import express from "express";
import bodyParser from "body-parser";
import env from 'dotenv';
import cors from 'cors';
import {connectDB} from "./connection.js"
import {logReqRes} from "./middlewares/index.js"

import jokeRoute from './routes/joke.js';
import otherRoute from './routes/other.js'

env.config();

const app = express();
const port = process.env.PORT;


let url =process.env.DB_URL;
connectDB(url);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(logReqRes('log.txt'));


app.use('/api',jokeRoute);
app.use('',otherRoute);

app.get('/',async (req,res)=>{
  // res.json({message:"Welcome to Jokes API"});
  res.render("home.ejs");
})


app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

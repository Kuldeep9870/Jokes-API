import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import env from 'dotenv';
import {Joke} from './models/model.js'
import fs from 'fs'
env.config();

const app = express();
const port = process.env.PORT;
const masterKey = process.env.KEY;

let url =process.env.DB_URL;
mongoose.connect(url);

app.use(bodyParser.urlencoded({ extended: true }));

try{

}
catch(err){
  res.json({error : err})
}

app.get('/',async (req,res)=>{
  // res.json({message:"Welcome to Jokes API"});
  res.render("home.ejs");
})


//1. GET a random joke
app.get('/random',async (req,res)=>{
  try{
    const size= await Joke.countDocuments();
    const random=Math.floor(Math.random()*size);
    console.log(random , size)
    const data = await Joke.findOne({ id: random }).select({_id:0});
    res.json(data);
  }
  catch(err){
    res.json({error : err})
  }
})

//2. GET a specific joke 
app.get('/jokes/:id',async(req,res)=>{
  // console.log(req);
  try{
    const id=parseInt(req.params.id);
    const data = await Joke.findOne({ id: id }).select({_id:0});
    res.json(data);
  }
  catch(err){
    res.json({error : err})
  }
  
  
})

//3. GET a jokes by filtering on the joke type
app.get('/filter',async(req,res)=>{
  // console.log(req);
  // console.log(req.query.type);
  const type=req.query.type;
  try{
    const data = await Joke.find({ jokeType: type }).select({_id:0,__v:0});
    res.json(data);
  }
  catch(err){
    res.json({error : err})
  }
})

//4. POST a new joke
app.post('/jokes',async (req,res)=>{
  //console.log(req.body);
  try{
    const size= await Joke.countDocuments();
    //console.log(size)
    const joke = await Joke.create({
      id:size+1,
      jokeText:req.body.text,
      jokeType:req.body.type,
    });
    res.json({message : `Joke added successfully at id=${size+1}`});

  }
  catch(err){
    res.json({error : err})
  }
})

//5. PUT a joke
app.put('/jokes/:id', async (req,res)=>{
  // console.log(req);
  const id=parseInt(req.params.id)
  const filter = { id:id };
  const update = { 
    jokeText:req.body.text,
    jokeType:req.body.type, 
  };

  try{
    await Joke.findOneAndUpdate(filter, update);
    const data = await Joke.findOne({ id: id }).select({_id:0,__v:0});
    res.json(data);

  }
  catch(err){
    res.json({error : err})
  }
})

//6. PATCH a joke
app.patch('/jokes/:id',async (req,res)=>{
  // console.log(req);

  const id=parseInt(req.params.id)

  const existing =await Joke.find({ id: id });
  const filter = { id:id };
  const update = { 
    jokeText:req.body.text || existing.jokeText,
    jokeType:req.body.type || existing.jokeType, 
  };
  
  try{
    await Joke.findOneAndUpdate(filter, update);
    const data = await Joke.findOne({ id: id }).select({_id:0,__v:0});
    res.json(data);
  }
  catch(err){
    res.json({error : err})
  }
})

//7. DELETE Specific joke
app.delete('/jokes/:id',async (req,res)=>{
  //console.log(req);

  const id=parseInt(req.params.id)
  
  try{
    const deleted = await Joke.deleteOne({ id: id });
  
    if(deleted.deletedCount>0){
      res.status(200).json({messgae:`Joke with id=${id} is deleted.`});
    }
    else{
      res.status(404).json({error:`Joke with id=${id} not found.No joke were deleted.`})
    }
  }
  catch(err){
    res.json({error : err})
  }
});

//8. DELETE All jokes
app.delete('/all',async (req,res)=>{
    const userKey=req.query.key;
    
    try{
      if(userKey===masterKey){
        Joke.collection.drop();
        res.status(200).json({message:`Delete action completed successfully`});
      }
      else{
      res.status(404).json({error:`You are not authorized to perform this action.`})
      }
    }
    catch(err){
      res.json({error : err})
    }
});

//resetall
app.get('/reset',async (req,res)=>{
  const userKey=req.query.key;
    
    try{
      if(userKey===masterKey){
        const jsonData = fs.readFileSync('./data.json', 'utf-8');
        const data = JSON.parse(jsonData);
  
        await Joke.insertMany(data);
        res.json({message:"Jokes are reset."})
      }
      else{
      res.status(404).json({error:`You are not authorized to perform this action.`})
      }
    }
    catch(err){
      res.json({error : err})
    }
})

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

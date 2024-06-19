import Joke from '../models/model.js';
import env from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


env.config();
const masterKey = process.env.KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname,'..', 'data.json');

async function getRandomJoke(req,res){
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
}

async function specificJoke(req,res){
  // console.log(req);
  try{
    const id=parseInt(req.params.id);
    const data = await Joke.findOne({ id: id }).select({_id:0});
    res.json(data);
  }
  catch(err){
    res.json({error : err})
  }
}

async function filteredJoke(req,res){
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
}

async function postJoke(req,res){
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
}

async function updateJoke(req,res){
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
}

async function patchJoke(req,res){
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
}

async function deleteJoke(req,res){
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
}

async function deleteAll(req,res){
  const userKey=req.query.key;
  console.log(userKey)
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
}

async function resetDB(req,res){
  const userKey=req.query.key;
      try{
        if(userKey===masterKey){
          
          const jsonData = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(jsonData);
          
          await Joke.insertMany(data);
          res.json({message:"Jokes are reset."})
        }
        else{
        res.json({error:`You are not authorized to perform this action.`})
        }
      }
      catch(err){
        res.json({error : err,
          message : "Action not fullfilled"
        })
      }
}

export {getRandomJoke,specificJoke,filteredJoke,postJoke,updateJoke,patchJoke,deleteJoke,deleteAll,resetDB};
import mongoose from "mongoose";

const jokeSchema = new mongoose.Schema({ 
    id: Number, 
    jokeText: String, 
    jokeType: String 
});

const Joke = mongoose.model('Joke', jokeSchema);

// module.exports  = Joke;

export default Joke;



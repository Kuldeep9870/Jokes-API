import mongoose from "mongoose";

const jokeSchema = new mongoose.Schema({ 
    id: Number, 
    jokeText: String, 
    jokeType: String 
});


export const Joke = mongoose.model('Joke', jokeSchema);

// module.exports = { 
//     Joke 
// }



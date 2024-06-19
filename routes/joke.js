import express from "express";
import Joke from '../models/model.js'
import env from 'dotenv';

import {getRandomJoke,specificJoke,filteredJoke,postJoke, updateJoke, patchJoke, deleteJoke, deleteAll, resetDB} from '../controllers/jokes.js'

env.config();


const router =express.Router();
  
  
  //1. GET a random joke
  router.get('/random',getRandomJoke)
  
  
  router.route('/jokes/:id',)
  .get(specificJoke) //2. GET a specific joke 

  
  //3. GET a jokes by filtering on the joke type
  router.get('/filter',filteredJoke)
  
  //4. POST a new joke
  router.post('/jokes',postJoke);
  
  
  router.route('/jokes/:id')
  .put(updateJoke)             //5. PUT a joke
  .patch(patchJoke)           //6. PATCH a joke
  .delete(deleteJoke);        //7. DELETE Specific joke

  
  
  //8. DELETE All jokes
  router.delete('/all',deleteAll);
  
  //resetall
  router.get('/reset',resetDB)


  export default router;
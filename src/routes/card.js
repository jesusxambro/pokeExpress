import { Router } from "express";
import fs from "fs";
import { dataPath } from "./cards.js";
import { pokeCardRequirements } from "../types/pokeCardRequirements.js";

const router = Router();



const updateCards = () => {
   let cards =  fs.readFileSync(dataPath, "utf8", (err, data) => {
        if (err) {
          throw err;
        }
        return JSON.parse(data);
      });
      cards = JSON.parse(cards);
      const hashmap = cards.reduce((acc, obj) => {
        acc[obj.id] = obj;
        return acc;
    }, {});
    return hashmap;
};

//this needs to be below updates from above due to sync reading
let cards= updateCards();;

const foundCard = false;


router.get('/:cardId', (req, res) => {
  if(!req.params.cardId){
    res.send().status(400);
  }
    cards = updateCards();
    if(cards[req.params.cardId] !== undefined){
      res.send(cards[req.params.cardId])
    }else{
      res.status(404).json({message: `Card with id:${req.params.cardId} not found!`});
    }
});


router.post("", pokeCardRequirements, (req, res) => {

res.json({message:'working..'});
})

export default router;
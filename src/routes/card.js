import { Router } from "express";
import fs from "fs";
import { dataPath } from "./cards.js";
import { pokeCardRequirements } from "../types/pokeCardRequirements.js";
import databaseAccess from "../utils/db.js";

const router = Router();
const updateCard = (foundCard, updatedFields) => {
    const finalCard ={};
    
    return finalCard;
};

router.get('/:cardId', async (req, res) => {
  if(!req.params.cardId ){
    res.send().status(400);
  }
  try{
    const idToLook = parseInt(req.params.cardId);
    const lookingUpCard = await databaseAccess.pokeCard.findUnique({where: {id: idToLook}});
    (lookingUpCard != (null || undefined)) ?
    res.status(200).json(lookingUpCard)
    :
    res.status(404).json({message: `Card with id:${req.params.cardId} not found!`})
  }catch(error){
    console.log(error?.message);
    res.status(500).json({message: "Something went wrong!"});
  }
});

router.post("", pokeCardRequirements, async (req, res) => {
    try{
        const newCard = await databaseAccess.pokeCard.create({data:{...req.body}})
        res.json(newCard);

    }catch(error){
        console.log(error?.message);
        res.status(500).json({message:`something went wrong!`})
    }});

router.put("/:cardId", async (req, res) => {
    if(!req.params.cardId || !req.body){
        res.send().status(400);
      }
      try{
        const idToLook = parseInt(req.params.cardId);
        const lookingUpCard = await databaseAccess.pokeCard.findUnique({where: {id: idToLook}});
        if(lookingUpCard != (null || undefined)){
        const updatedCard = await updatedCard(lookingUpCard, req.body);
            res.status(200).json(lookingUpCard)
        }else{
            res.status(404).json({message: `Card with id:${req.params.cardId} not found!`})
        }
      }catch(error){
        console.log(error?.message);
        res.status(500).json({message: "Something went wrong!"});
      }
})

export default router;
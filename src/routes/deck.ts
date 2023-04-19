import { Router } from 'express';
import databaseAccess from "../utils/db";
import { PokeDeck } from '@prisma/client';

const router = Router();

router.get("/:deckId", async (req, res) => {
  if (!req.params.deckId) {
    res.send().status(400);
  }
  try {
    const idToLook = parseInt(req.params.deckId);
    let lookingUpCard : PokeDeck | null= await databaseAccess.pokeDeck.findUnique({
      where: { id: idToLook }, include:{cards:true},
    });


    lookingUpCard != (null || undefined)
      ? res.status(200).json(lookingUpCard)
      : res
          .status(404)
          .json({ message: `Deck with id:${req.params.deckId} not found!` });
  } catch (error: any) {
    console.log(error?.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
});
router.post("/", async (req, res) => {
  if(!req.body){
    res.send().status(400);
  }
  try{
    let savedPokeDeck = await databaseAccess.pokeDeck.create({data:{
      description: req.body.description,
      name: req.body.name,
      cards: req.body.body.cards
    }})
    res.status(200).json(savedPokeDeck);

  }catch(error: any) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong posting your deck!" });
  }
})

export default router;
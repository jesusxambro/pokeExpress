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
    console.log(req.body);
    let savedPokeDeck = await databaseAccess.pokeDeck.create({data:{
      description: req.body.description,
      name: req.body.name,
      cards: {
        create: req.body.cards}
    }})
    res.status(200).json(savedPokeDeck);

  }catch(error: any) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong posting your deck!" });
  }
})

router.put("/:id", async (req, res) => {
  if (!req.body) {
    res.send().status(400);
  }
  const { id } = req.params;
  try {
    const existingDeck = await databaseAccess.pokeDeck.findUnique({
      where: { id: Number(id) },
    });
    if (!existingDeck) {
      res.status(404).json({ message: "Deck not found!" });
      return;
    }
    const { name, description } = req.body;

    const updatedDeck = await databaseAccess.pokeDeck.update({
      where: { id: Number(id) },
      data: {
        name: name ? name : existingDeck.name,
        description: description ? description : existingDeck.description
    }});
    res.status(200).json(updatedDeck);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong updating the deck!" });
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.send().status(400);
  }
  const deckId = Number(req.params.id);
  const lookUpDeck = await databaseAccess.pokeDeck.findUnique(
    {
      where:{
        id: deckId,
      }
    }
  );
  if(!lookUpDeck) {
    res.status(404).json({ message: `Deck with id: ${deckId}, not found.` });
  };

  try {
    const deletedDeck = await databaseAccess.pokeDeck.delete({
      where: {
        id: deckId
      }
    });
    res.status(200).json(deletedDeck);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong deleting the deck." });
  }
});

export default router;
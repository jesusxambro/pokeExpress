import { Router } from 'express';
import databaseAccess from "../utils/db";
import { PokeCard, PokeDeck } from '@prisma/client';

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
  if (!req.body) {
    res.send().status(400);
  }
  try {
    const cardPromises = req.body.cards.map(async (card :any) => {
      const existingCard = await databaseAccess.pokeCard.findFirst({
        where: {
          name: card.name,
          hp: card.hp,
          description: card.description,
          type: card.type,
        },
      });

      return existingCard
        ? existingCard
        : await databaseAccess.pokeCard.create({ data: card });
    });

    // Wait for all card operations to complete
    const resolvedCards = await Promise.all(cardPromises);
    console.log(resolvedCards);

    const savedPokeDeck = await databaseAccess.pokeDeck.create({
      data: {
        description: req.body.description,
        name: req.body.name,
        cards: {
          connect: resolvedCards.map((card) => ({ id: card.id })),
        },
      },
    });

    res.status(200).json(savedPokeDeck);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong posting your deck!" });
  }
});

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
  const lookUpDeck :any = await databaseAccess.pokeDeck.findUnique({
    where: {
      id: deckId,
    },
    select:{
      cards:true //also gets the cards in the joint table _PokeCardToPokeDeck
    }
  });
  if (!lookUpDeck) {
    res.status(404).json({ message: `Deck with id: ${deckId}, not found.` });
  }
  try {
    //console.log(lookUpDeck);
    await databaseAccess.pokeDeck.update({
      where: {
        id: deckId,
      },
      data: {
        cards: {
          disconnect: lookUpDeck.cards.map((card:PokeCard) => ({ id: card.id })),
        },
      },
    });
    const deletedDeck = await databaseAccess.pokeDeck.delete({
      where: {
        id: deckId,
      },
    });
    res.status(200).json(deletedDeck);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong deleting the deck." });
  }
});

export default router;
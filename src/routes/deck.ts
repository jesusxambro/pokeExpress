import { Router } from 'express';
import databaseAccess from "../utils/db";
import { PokeCard, PokeDeck } from '@prisma/client';
import {pokeCardRequirements} from "../types/pokeCardRequirements";

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
router.get("/:id/cards", async (req, res) => {
  if (!req.params.id) {
    res.send().status(400);
  }
  const deckId = parseInt(req.params.id);

  try {
    const deckFound = await databaseAccess.pokeDeck.findUnique({
      where: {
        id: deckId,
      },
      include: {
        cards: true,
      },
    });

    if (!deckFound) {
      res.status(404).json({ message: `Deck with id:${deckId} not found.` });
    } else {
      res.status(200).json(deckFound.cards);
    }
  } catch (error :any) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong while fetching the cards." });
  }
});
router.post("/:id/card", pokeCardRequirements, async (req, res) => {
  if (!req.params.id) {
    res.send().status(400);
  }
  const deckId = parseInt(req.params.id);

  try {
    const deckFound = await databaseAccess.pokeDeck.findUnique({
      where: {
        id: deckId,
      },
    });

    if (!deckFound) {
      res.status(404).json({ message: `Deck with id:${deckId} not found.` });
    } else {
      const newCard = await databaseAccess.pokeCard.create({
        data: {
          ...req.body,
          pokeDeck: {
            connect: { id: deckId },
          },
        },
      });
      res.json(newCard);
    }
  } catch (error :any) {
    console.log(error.message);
    res.status(500).json({ message: `Something went wrong!` });
  }
});
router.get("/:id/card/:card_id", async (req, res) => {
  if (!req.params.id || !req.params.card_id) {
    res.send().status(400);
  }
  const deckId = parseInt(req.params.id);
  const cardId = parseInt(req.params.card_id);

  try {
    const deckFound = await databaseAccess.pokeDeck.findUnique({
      where: {
        id: deckId,
      },
      include: {
        cards: {
          where: {
            id: cardId,
          },
        },
      },
    });

    if (!deckFound) {
      res.status(404).json({ message: `Deck with id:${deckId} not found.` });
    } else if (deckFound.cards.length === 0) {
      res.status(404).json({ message: `Card with id:${cardId} not found in deck with id:${deckId}.` });
    } else {
      res.status(200).json(deckFound.cards[0]);
    }
  } catch (error:any) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong while fetching the card." });
  }
});

router.put("/:id/card/:card_id", async (req, res) => {
  if (!req.params.id || !req.params.card_id) {
    res.send().status(400);
  }
  const deckId = parseInt(req.params.id);
  const cardId = parseInt(req.params.card_id);

  try {
    const deckFound = await databaseAccess.pokeDeck.findUnique({
      where: {
        id: deckId,
      },
      include: {
        cards: {
          where: {
            id: cardId,
          },
        },
      },
    });

    if (!deckFound) {
      res.status(404).json({ message: `Deck with id:${deckId} not found.` });
    } else if (deckFound.cards.length === 0) {
      res.status(404).json({ message: `Card with id:${cardId} not found in deck with id:${deckId}.` });
    } else {
      const updatedCard = await databaseAccess.pokeCard.update({
        where: { id: cardId },
        data: { ...req.body },
      });
      res.status(200).json(updatedCard);
    }
  } catch (error : any ) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong while updating the card." });
  }
});

router.delete("/:id/card/:card_id", async (req, res) => {
  if (!req.params.id || !req.params.card_id) {
    res.send().status(400);
  }
  const deckId = parseInt(req.params.id);
  const cardId = parseInt(req.params.card_id);

  try {
    const deckFound = await databaseAccess.pokeDeck.findUnique({
      where: {
        id: deckId,
      },
      include: {
        cards: {
          where: {
            id: cardId,
          },
        },
      },
    });

    if (!deckFound) {
      res.status(404).json({ message: `Deck with id:${deckId} not found.` });
    } else if (deckFound.cards.length === 0) {
      res.status(404).json({ message: `Card with id:${cardId} not found in deck with id:${deckId}.` });
    } else {
      const updatedDeck = await databaseAccess.pokeDeck.update({
        where: { id: deckId },
        data: {
          cards: {
            disconnect: { id: cardId },
          },
        },
      });
      res.status(200).json({ message: `Card with id:${cardId} has been removed from deck with id:${deckId}.` });
    }
  } catch (error :any) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong while removing the card from the deck." });
  }
});
export default router;
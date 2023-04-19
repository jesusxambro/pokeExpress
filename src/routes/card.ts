import { Router } from "express";
import fs from "fs";
import { dataPath } from "./cards";
import { pokeCardRequirements } from "../types/pokeCardRequirements";
import databaseAccess from "../utils/db";
import { PokeCard } from "@prisma/client";
import { simpleBodyValidator } from "../types/simpleBodyValidator";

const router = Router();
router.get("/plain/:cardId", async (req, res) => {
  if (!req.params.cardId) {
    res.send().status(400);
  }
  try {
    const idToLook = parseInt(req.params.cardId);
    const lookingUpCard = await databaseAccess.pokeCard.findUnique({
      where: { id: idToLook },
    });
    lookingUpCard != (null || undefined)
      ? res.status(200).send(JSON.stringify(lookingUpCard))
      : res
          .status(404)
          .json({ message: `Card with id:${req.params.cardId} not found!` });
  } catch (error: any) {
    console.log(error?.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/:cardId", async (req, res) => {
  if (!req.params.cardId) {
    res.send().status(400);
  }
  try {
    const idToLook = parseInt(req.params.cardId);
    const lookingUpCard = await databaseAccess.pokeCard.findUnique({
      where: { id: idToLook },
    });
    lookingUpCard != (null || undefined)
      ? res.status(200).json(lookingUpCard)
      : res
          .status(404)
          .json({ message: `Card with id:${req.params.cardId} not found!` });
  } catch (error: any) {
    console.log(error?.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("", pokeCardRequirements, async (req, res) => {
  try {
    const newCard = await databaseAccess.pokeCard.create({
      data: { ...req.body },
    });
    res.json(newCard);
  } catch (error: any) {
    console.log(error?.message);
    res.status(500).json({ message: `something went wrong!` });
  }
});

router.put("/:cardId", async (req: any, res: any) => {
  const updateCard = (foundCard: PokeCard, updatedFields: any) => {
    const finalCard: PokeCard = { ...foundCard, ...updatedFields };
    return finalCard;
  };
  if (!req.params.cardId || !req.body) {
    res.send().status(400);
  }
  try {
    const idToLook = parseInt(req.params.cardId);
    const lookingUpCard = await databaseAccess.pokeCard.findUnique({
      where: { id: idToLook },
    });
    if (lookingUpCard != (null || undefined)) {
      const updatedCard: any = await updateCard(lookingUpCard, req.body);
      //save the updatedCard
      const savedCard = await databaseAccess.pokeCard.update({
        where: { id: lookingUpCard.id },
        data: { ...updatedCard },
      });
      res.status(200).json(savedCard);
    } else {
      res
        .status(404)
        .json({ message: `Card with id:${req.params.cardId} not found!` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.delete("/:cardId", async (req, res) => {
  if (!req.params.cardId) {
    res.send().status(400);
  }
  try {
    const idToLook = parseInt(req.params.cardId);
    const didDelete = await databaseAccess.pokeCard.delete({
      where: { id: idToLook },
    });
    res.status(200).json({ message: "Succesfully deleted." });
  } catch (error: any) {
    console.log(error.message);
    res.end().status(500);
  }
});


export default router;

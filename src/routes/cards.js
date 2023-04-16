import { Router } from "express";
import databaseAccess from "../utils/db.js";

const router = Router();

export const dataPath = process.cwd() + "/cards.json";

router.get("/", async (req, res) => {
 const cards = await databaseAccess.pokeCard.findMany();
 res.json(cards);
});

export default router;

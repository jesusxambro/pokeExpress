import { Router } from 'express';
import databaseAccess from "../utils/db";

const router = Router();

export const dataPath = process.cwd() + "/cards.json";

router.get('/', async (req, res) => {
  const cards = await databaseAccess.pokeDeck.findMany({include:{cards:true}});
  res.json(cards);
});

export default router;
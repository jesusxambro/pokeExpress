import { Router } from 'express';
import databaseAccess from "../utils/db";

const router = Router();


router.get('/', async (req, res) => {
  const cards = await databaseAccess.pokeDeck.findMany({include:{cards:true}});
  res.json(cards);
});

export default router;
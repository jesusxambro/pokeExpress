import { Router } from "express";
import fs from "fs";
import { dataPath } from "./cards.js";

const router = Router();

let cards;

const updateCards = () => {
    let cards;
    fs.readFileSync(dataPath, "utf8", (err, data) => {
        if (err) {
          throw err;
        }
        cards= JSON.parse(data);
        
      });
      console.log(cards);
      return cards;
};

const foundCard = false;

router.get('/:cardId', (req, res) => {
    cards = updateCards();

    res.send(cards);
});


router.post('/:cardId', (req, res) => {
console.log(req.body);
foundCard?
res.status(200).send('Found Card!')
:
res.status(404).send('Card not found.');
res.end();
})

export default router;
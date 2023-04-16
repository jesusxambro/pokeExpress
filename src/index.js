import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes/index.js";
 


const app = express();

app.use(cors());

app.use('/card', routes.card);
app.use('/cards', routes.cards);
app.use('/deck', routes.deck);
app.use('/decks', routes.decks);

app.use(express.json());


app.get("/", (req, res) => {
  return res.send("Please use the correct route.");
});

const port = process.env.PORT || 3000;


app.listen(port, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);

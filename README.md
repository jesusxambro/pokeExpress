# Poke Express Backend API
This project is a simple RESTful API built in Express.js, Prisma ORM, SQLite, and Typescript.
## Installation
1. This project requires [Node](https://nodejs.org/en) to be installed. It is offered in many operating systems.
   Please use the LTS version, which should be 18.
2. After installing, open a terminal in this directory.
3. Run this command:

   ```npm install```
4. After the command has been run, you should see a new folder called node_modules.
5. Next, run the following command to set up the database and seed it.

   ```npm run setup```
6. Next, you are ready to start the server!

   ```npm run start```

## Usage
To use this API, there are 4 main routes. 
### Cards
http://localhost:3005/cards
The 'cards' route only has 1 method. 'GET' request returns a list of all cards currently available.

### Card
The card route handles 5 request.
##### Plain
The plain route returns a text representation of the card to browsers.
http://localhost:3005/card/plain/:id where id is the ID of the card or a not found.

##### GET
http://localhost:3005/card/:id
Returns a JSON object of the card or message of not found. 

##### POST
http://localhost:3005/card/
A body is required in JSON format of the card that follows this object:
```    
   {
      "hp": 90,
      "name": "Squirtle",
      "description": "A water type Pokemon with a turtle-like appearance.",
      "type": "Water"
    }
```
There is validation on line 47 of 'card.ts' that checks that all values are inputted. 
The return response is the object itself and completed with id and time stamp of creation.

##### PUT
http://localhost:3005/card/:id
A field of the card is required in JSON format.
If the id is not found, the API will return a 404. 
The object expected is this:
```
{
      "hp": number,
      "name": string,
      "description": string,
      "type": string
}
```
##### DELETE
http://localhost:3005/card/:id
This call will delete the card if found but also not delete if it is associated with a deck.


## Decks
http://localhost:3005/decks
The 'decks' route for 'GET' requests, returns a list of all decks currently in the database.

#### Deck GET
http://localhost:3005/deck/:id
This request returns either the deck or a not found based on the id. 

#### Deck POST
http://localhost:3005/deck/:id
This request adds the new deck and its cards to the database.
We check first if the cards are already in the database, if not, we create the cards.

#### Deck PUT
http://localhost:3005/deck/:id
This request updates only the name or description of the deck with the specified id.

#### Deck DELETE
http://localhost:3005/deck/:id
This request disassociates the relation with the cards to this deck,
then deletes the deck from the database.

#### Deck Cards GET
http://localhost:3005/deck/:id/cards
This request returns all the cards associated with the deck in the specified ID. 

#### Deck Card POST
http://localhost:3005/deck/:id/card
This request checks if the card exists, and if it does, associates it with the deck,
or creates a new card associated with this deck ID.

#### Deck Card GET
http://localhost:3005/deck/:id/card/:cardId
This request returns the spedicifed card in the specidfied deck.

#### Deck Card PUT
http://localhost:3005/deck/:id/card/:cardId
This request updates the card in the specified deck.

#### Deck Card DELETE
http://localhost:3005/deck/:id/card/:cardId
This request deletes the association with the card and the specified deck.



### Example Deck in JSON:

```JSON
{
  "name": "Second Pokemon Deck",
  "description": "Second Deck",
  "cards": [
    {
      "hp": 90,
      "name": "Squirtle",
      "description": "A water type Pokemon with a turtle-like appearance.",
      "type": "Water"
    },
    {
      "hp": 80,
      "name": "Bulbasaur",
      "description": "A grass/poison type Pokemon with a bulb on its back.",
      "type": "Grass/Poison"
    },
    {
      "hp": 110,
      "name": "Charmander",
      "description": "A fire type Pokemon with a fiery tail.",
      "type": "Fire"
    }
  ]
}
```

### Example Card in JSON

```JSON
{
  "hp": 100,
  "name": "Mew",
  "description": "A rare and mythical Psychic type Pokemon with the ability to learn any move.",
  "type": "Psychic"
}

```

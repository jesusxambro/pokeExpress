// const { PrismaClient } = require('@prisma/client');
import { PrismaClient } from '@prisma/client';
// const seedData = require('./seedCards');



const dbPrisma = new PrismaClient();


const seed = async () => {
    const seedData =[
        {
          "hp": 100,
          "name": "Charizard",
          "description": "A fire-breathing dragon-like Pokemon.",
          "type": "Fire/Flying"
        },
        {
          "hp": 80,
          "name": "Bulbasaur",
          "description": "A grass/poison type Pokemon with a bulb on its back.",
          "type": "Grass/Poison"
        },
          {
              "hp": 120,
              "name": "Pikachu",
              "description": "A cute and popular electric type Pokemon.",
              "type": "Electric"
          },
          {
              "hp": 70,
              "name": "Jigglypuff",
              "description": "A fairy/normal type Pokemon known for its lullaby song.",
              "type": "Fairy/Normal"
          },
          {
              "hp": 90,
              "name": "Squirtle",
              "description": "A water type Pokemon with a turtle-like appearance.",
              "type": "Water"
          },
          {
              "hp": 100,
              "name": "Eevee",
              "description": "A normal type Pokemon with the ability to evolve into different forms.",
              "type": "Normal"
          }
      ]
    //delete all tables
    await dbPrisma.pokeDeck.deleteMany({});
    await dbPrisma.pokeCard.deleteMany({});
    //add cards
    const dbCards = await Promise.all(seedData.map(card => dbPrisma.pokeCard.create({
        data:{...card}
    })))
    //add create deck
    await dbPrisma.pokeDeck.create({
        data:{description: "First Deck",
    name:"First Seeding Pokemon Deck",
    cards:{connect:dbCards.map(card => ({id:card.id}))}
}
    })
};

seed().catch((e) => {
    console.log(e);
    process.exit(1);
}).finally(
    async() => {
        await dbPrisma.$disconnect();
    }
);
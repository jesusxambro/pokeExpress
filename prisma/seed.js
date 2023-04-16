import { PrismaClient } from "@prisma/client";
import seedData from "./seedCards.js";


const dbPrisma = new PrismaClient();


const seed = async () => {
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
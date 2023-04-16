-- CreateTable
CREATE TABLE "PokeCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hp" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PokeDeck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_PokeCardToPokeDeck" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PokeCardToPokeDeck_A_fkey" FOREIGN KEY ("A") REFERENCES "PokeCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PokeCardToPokeDeck_B_fkey" FOREIGN KEY ("B") REFERENCES "PokeDeck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PokeCard_id_key" ON "PokeCard"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PokeDeck_id_key" ON "PokeDeck"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_PokeCardToPokeDeck_AB_unique" ON "_PokeCardToPokeDeck"("A", "B");

-- CreateIndex
CREATE INDEX "_PokeCardToPokeDeck_B_index" ON "_PokeCardToPokeDeck"("B");

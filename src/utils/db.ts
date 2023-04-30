import { PrismaClient } from "@prisma/client";

let databaseAccess = new PrismaClient();

export default databaseAccess;

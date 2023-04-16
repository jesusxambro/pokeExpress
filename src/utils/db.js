import { PrismaClient } from "@prisma/client";

let databaseAccess = new PrismaClient();;
// if(!global.__prisma__){
//     global.__prisma__ = new PrismaClient();
// }
export default databaseAccess;

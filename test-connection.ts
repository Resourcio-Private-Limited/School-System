import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

async function main() {
    console.log("Testing connection to:", process.env.DATABASE_URL?.split("@")[1]); // Mask password
    try {
        const count = await prisma.user.count();
        console.log("Connection successful! User count:", count);
    } catch (e: any) {
        console.error("Connection failed!");
        console.error(e.message);
        console.error(JSON.stringify(e, null, 2));
    } finally {
        await prisma.$disconnect();
    }
}

main();

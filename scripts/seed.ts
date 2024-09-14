import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: "Web Development Bootcamp" },
                { name: "Full Stack Web Developer" },
                { name: "Mastering Modern JavaScript" },
                { name: "React for Beginners" },
                { name: "Building Responsive Websites" },
                { name: "Vue.js Fundamentals" },
                { name: "Node.js and Express.js" },
                { name: "Advanced Web Security" },
                { name: "Front-End Development Mastery" },
                { name: "Back-End Development with Python" },
            ],
        });

        console.log("seed categories success");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await db.$disconnect();
    }
}

main();

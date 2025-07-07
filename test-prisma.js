// // const { PrismaClient } = require('@prisma/client');
// const { prisma } = require('./src/config/db');
// // const prisma = new PrismaClient();

// async function main() {
//     const quizzes = await prisma.quiz.findMany();
//     console.log(quizzes);
// }

// main()
//   .then(() => prisma.$disconnect())
//   .catch((e) => {
//     console.error(e);
//     prisma.$disconnect();
//   });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    const quiz = await prisma.quiz.findFirst({
        include: { questions: true }
    });

    console.dir(quiz, { depth: null });
}

test();

// const mongoose = require('mongoose');

// async function connect() {
//     try {
//         mongoose.connect('mongodb://127.0.0.1:27017/quizs');
//         console.log('Connect successfully');
//     } catch (error) {
//         console.log('fail to connect');
//     }
// }

// module.exports = { connect };

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function connect(){
    try {
        await prisma.$connect();
        console.log('Kết nối database thành công');
    }catch(err){
        console.error('Lỗi kết nối database: ', err);
    }
}

module.exports = { connect, prisma };
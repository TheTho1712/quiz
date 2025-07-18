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
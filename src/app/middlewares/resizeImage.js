const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../../public/img');

const resizeImage = async (req, res, next) => {
    if (req.file) {
        const filePath = path.join(uploadPath, req.file.filename);
        const resizedFilePath = path.join(uploadPath, `resized-${req.file.filename}`);

        try {
            await sharp(filePath)
                .resize(300, 168)
                .toFile(resizedFilePath);

            fs.unlinkSync(filePath);
            req.file.filename = `resized-${req.file.filename}`;
        } catch (error) {
            console.error('Error resizing image:', error);
            return res.status(500).send('Error processing image');
        }
    }
    next();
};

module.exports = resizeImage;
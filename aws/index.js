const AWS = require('aws-sdk');
//const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = 'kr-standard';

const S3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
const fileFilter = function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const allowedExt = ['jpeg', 'jpg', 'png'];
    if (allowedExt.includes(fileExt)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const upload = multer({
    storage: multerS3({
        s3: S3,
        bucket: process.env.IMAGE_BUCKET_NAME,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key(req, file, cb) {
            cb(null, `images/${Date.now()}_${path.basename(file.originalname)}`)
        },
        fileFilter: fileFilter,
    }),
    limits: { fileSize: 10 * 1024 * 1024 }
});

const deleteImage = async (filename) => {
    console.log(filename)
    const fileName = filename
    await S3.deleteObject({
        Bucket: process.env.IMAGE_BUCKET_NAME,
        Key:fileName
    }).promise();
}

module.exports = { upload, deleteImage };







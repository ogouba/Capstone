const multer = require('multer');
const cloudinary = require('cloudinary');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

cloudinary.config({
    cloud_name: 'dcuckatas',
    api_key: '995179956656439',
    api_secret: 'EehBxe-7GAIby52nrzN1O9yEoXY'
});

async function handleUpload(file) {
    const res = await cloudinary.v2.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single("video");
const { exampleVideoData } = require("./utils")

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

const handler = async (req, res) => {
    console.log(req.session);
    try {
        await runMiddleware(req, res, myUploadMiddleware);
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        const { videos } = prisma.user.update({
            where: {
                id: req.session.user.id
            },
            data: {
                videos: {
                    push: cldRes
                }
            },
            select: {
                videos: true
            }
        })
        res.json(videos);
    } catch (error) {
        console.log(error);
        res.send({
            message: error.message,
        });
    }
};

const config = {
    api: {
        bodyParser: false,
    },
};

module.exports = { handler, config };
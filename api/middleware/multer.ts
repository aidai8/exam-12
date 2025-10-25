import multer from "multer";
import path from "path";
import {promises as fs} from "fs";
import {randomUUID} from "node:crypto";
import config from "../config";

const imageStorage = multer.diskStorage({
    destination: async (_req, _file, callback) => {
        const destDir = path.join(config.publicPath);
        await fs.mkdir(destDir, { recursive: true });
        callback(null, destDir);
    },
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname);
        const newFileName = randomUUID() + extension;
        callback(null, 'images/' + newFileName);
    }
});

export const imagesUpload = multer({storage: imageStorage});
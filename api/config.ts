import path from 'path';
import {configDotenv} from 'dotenv';

const rootPath = __dirname;
configDotenv();

const config = {
    rootPath,
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    publicPath: path.join(rootPath, 'public'),
    db: 'mongodb://localhost/exam-12'
};

export default config;
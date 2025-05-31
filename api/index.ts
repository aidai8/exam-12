import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./routers/users";
import config from "./config";
import cookieParser from 'cookie-parser';
import adminRouter from "./routers/admin";

const app = express();
const port = 8000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use('/admin', adminRouter);
app.use('/users', usersRouter);

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(console.error);


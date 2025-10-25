import express from "express";
import User from "../models/User";
import {UserFields} from "../types";
import mongoose from "mongoose";
import {OAuth2Client} from "google-auth-library";
import config from "../config";

const usersRouter = express.Router();
const client = new OAuth2Client(config.google.clientId);

usersRouter.post('/google', async (req,res, next) => {
    try {
        if (!req.body.credential) {
            res.status(400).send({error: "Google login error"});
            return;
        }
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            res.status(400).send({error: 'Google login error'});
            return;
        }

        const email = payload['email'];
        const id = payload['sub'];
        const displayName = payload['name'];

        if (!email) {
            res.status(400).send({error: "No enough user data to continue!"});
            return;
        }

        let user = await User.findOne({googleId: id});

        if (!user) {
            user = new User({
                email: email,
                password: crypto.randomUUID(),
                googleId: id,
                displayName
            });
        }

        user.generateToken();
        await user.save();

        res.send(user);
    } catch (error) {
        next(error);
    }
});

usersRouter.post('/', async (req, res, next) => {
    const userData: Omit<UserFields, 'token'> = {
        email: req.body.email,
        displayName: req.body.displayName,
        password: req.body.password,
        googleId: req.body.googleId
    };

    try {
        const user = new User(userData);
        user.generateToken();

        await user.save();
        res.send(user);
    } catch(error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});


usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            res.status(400).send({error: 'Email not found!'});
            return;
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            res.status(400).send({error: 'Password is wrong!'});
            return;
        }

        user.generateToken();
        await user.save();

        res.send(user);
    } catch(error) {
        next(error);
    }
});

usersRouter.delete('/sessions', async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            res.status(204).send();
            return;
        }

        const user = await User.findOne({token});

        if (!user) {
            res.status(204).send();
            return;
        }

        user.generateToken();
        user.save();

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default usersRouter;
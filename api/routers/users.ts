import express from "express";
import {Error} from 'mongoose';
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";
import {OAuth2Client} from "google-auth-library";
import config from "../config";
import crypto from 'crypto';
import {imagesUpload} from "../middleware/multer";

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
        const googleID = payload['sub'];
        const displayName = payload['name'];

        if (!email) {
            res.status(400).send({error: "No enough user data to continue!"});
            return;
        }

        let user = await User.findOne({googleID: googleID});

        let genPassword = crypto.randomUUID();

        if (!user) {
            user = new User({
                email: email,
                password: genPassword,
                confirmPassword: genPassword,
                displayName: displayName || email.split('@')[0],
                googleID,
            });

            await user.save();
            user.generateToken();
            await user.save();
        } else {
            user.generateToken();
            await user.save();
        }

        console.log(payload);
        res.send('Login with Google successfully.');
    } catch (e) {
        next(e);
    }
});

usersRouter.post('/', async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.displayName) {
            res.status(400).send({error: 'Email, password and display name are required'});
            return;
        }

        if (req.body.password !== req.body.confirmPassword) {
            res.status(400).send({error: 'Passwords do not match'});
            return;
        }

        const user = new User({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName,
        });

        user.confirmPassword = req.body.confirmPassword;

        user.generateToken();
        await user.save();

        const safeUser = {
            _id: user._id,
            email: user.email,
            role: user.role,
            displayName: user.displayName,
        };

        res.send({user: safeUser, message: 'Registered successfully.'});
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, _next) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({error: 'Email and password must be in req'});
        return;
    }

    const user = await User.findOne({email: req.body.email});

    if (!user) {
        res.status(404).send({error: "Email not found"});
        return;
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
        res.status(400).send({error: 'Password is incorrect'});
        return;
    }

    user.generateToken();
    await user.save();

    res.cookie('token', user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // CSRF
    });

    const safeUser = {
        _id: user._id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
    };

    res.send({message: 'Email and password is correct', user: safeUser});
});

usersRouter.delete('/sessions', auth, async (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
        res.send({message: 'Success logout'});
        return;
    }

    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    try {
        const user = await User.findOne({token});

        if (user) {
            user.generateToken();
            await user.save();
        }

        res.send({message: 'Success logout'});
    } catch (e) {
        next(e);
    }
});

usersRouter.post('/secret', auth, async (req, res, _next) => {
    const user = (req as RequestWithUser).user;

    res.send({
        message: 'Secret message',
        user: user,
    });
});


export default usersRouter;
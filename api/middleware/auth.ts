import {Response, NextFunction} from "express";
import {RequestWithUser} from "../types";
import User from "../models/User";

const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = req.get('Authorization');
        if (!token) {
            return res.status(401).send({error: 'No token present'});
        }

        const user = await User.findOne({token});
        if (!user) {
            return res.status(401).send({error: 'Wrong token!'});
        }

        req.user = user;
        next();
    } catch (e) {
        return res.status(500).send({ error: 'Server error during auth' });
    }
};

export default auth;
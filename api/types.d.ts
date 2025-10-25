import {Request} from "express";
import {HydratedDocument} from "mongoose";

export interface UserFields {
    email: string;
    displayName: string;
    password: string;
    token: string;
    googleId: string;
}

export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>
}
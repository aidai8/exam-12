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

export interface RecipeFields {
    title: string;
    description: string;
    image: string;
    author: Types.ObjectId;
}

export interface CommentFields {
    text: string;
    recipe: Types.ObjectId;
    author: Types.ObjectId;
}
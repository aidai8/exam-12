import express from "express";
import mongoose from "mongoose";
import Comment from "../models/Comment";
import Recipe from "../models/Recipe";
import auth from "../middleware/auth";
import {RequestWithUser} from "../types";

const commentsRouter = express.Router();

commentsRouter.post("/:recipeId", auth, async (req, res, next) => {
    try {
        const userReq = req as RequestWithUser;
        const { recipeId } = userReq.params;
        const { text } = userReq.body;

        if (!mongoose.isValidObjectId(recipeId)) {
            res.status(400).send({ error: "Invalid recipe id" });
            return;
        }

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            res.status(404).send({ error: "Recipe not found" });
            return;
        }

        if (!text) {
            res.status(400).send({ error: "Comment text is required" });
            return;
        }

        const comment = new Comment({
            text,
            recipe: recipeId,
            author: userReq.user._id,
        });

        await comment.save();
        await comment.populate("author", "displayName");
        res.send(comment);
    } catch (error) {
        next(error);
    }
});

commentsRouter.delete("/:id", auth, async (req, res, next) => {
    try {
        const userReq = req as RequestWithUser;
        const { id } = userReq.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(400).send({ error: "Invalid comment id" });
            return;
        }

        const comment = await Comment.findById(id);

        if (!comment) {
            res.status(404).send({ error: "Comment not found" });
            return;
        }

        const recipe = await Recipe.findById(comment.recipe);

        if (!recipe) {
            res.status(404).send({ error: "Recipe not found" });
            return;
        }

        const isAuthor = comment.author.equals(userReq.user._id);
        const isRecipeOwner = recipe.author.equals(userReq.user._id);

        if (!isAuthor && !isRecipeOwner) {
            res.status(403).send({ error: "You don't have permission to delete this comment" });
            return;
        }

        await comment.deleteOne();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default commentsRouter;
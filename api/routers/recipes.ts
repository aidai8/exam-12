import express from "express";
import mongoose from "mongoose";
import Recipe from "../models/Recipe";
import Comment from "../models/Comment";
import {imagesUpload} from "../middleware/multer";
import auth from "../middleware/auth";
import {RequestWithUser} from "../types";


const recipesRouter = express.Router();

recipesRouter.get("/", async (_req, res, next) => {
    try {
        const recipes = await Recipe.find().populate("author", "displayName");
        res.send(recipes);
    } catch (error) {
        next(error);
    }
});

recipesRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(400).send({ error: "Invalid recipe id" });
            return;
        }

        const recipe = await Recipe.findById(id).populate("author", "displayName");

        if (!recipe) {
            res.status(404).send({ error: "Recipe not found" });
            return;
        }

        const comments = await Comment.find({ recipe: id }).populate("author", "displayName");

        res.send({ recipe, comments });
    } catch (error) {
        next(error);
    }
});

recipesRouter.get("/by-author/:authorId", async (req, res, next) => {
    try {
        const { authorId } = req.params;

        if (!mongoose.isValidObjectId(authorId)) {
            res.status(400).send({ error: "Invalid author id" });
            return;
        }

        const recipes = await Recipe.find({ author: authorId }).populate("author", "displayName");

        res.send(recipes);
    } catch (error) {
        next(error);
    }
});

recipesRouter.post("/", auth, imagesUpload.single("image"), async (req, res, next) => {
    try {
        const userReq = req as RequestWithUser;
        const { title, description } = userReq.body;
        const image = userReq.file ? userReq.file.path : null;

        if (!title || !description || !image) {
            res.status(400).send({ error: "All fields are required" });
            return;
        }

        const recipe = new Recipe({
            title,
            description,
            image,
            author: userReq.user._id,
        });

        await recipe.save();
        await recipe.populate("author", "displayName");
        res.send(recipe);
    } catch (error) {
        next(error);
    }
});


recipesRouter.delete("/:id", auth, async (req, res, next) => {
    try {
        const request = req as RequestWithUser;
        const { id } = request.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(400).send({ error: "Invalid recipe id" });
            return;
        }

        const recipe = await Recipe.findById(id);

        if (!recipe) {
            res.status(404).send({ error: "Recipe not found" });
            return;
        }

        if (!recipe.author.equals(request.user._id)) {
            res.status(403).send({ error: "You can delete only your own recipes" });
            return;
        }

        await Comment.deleteMany({ recipe: id });
        await recipe.deleteOne();

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default recipesRouter;
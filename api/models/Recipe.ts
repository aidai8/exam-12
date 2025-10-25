import mongoose, {Model} from "mongoose";
import {RecipeFields} from "../types";

type RecipeModel = Model<RecipeFields>;

const Schema = mongoose.Schema;

const RecipeSchema = new Schema<RecipeFields, RecipeModel>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Recipe = mongoose.model<RecipeFields, RecipeModel>("Recipe", RecipeSchema);
export default Recipe;
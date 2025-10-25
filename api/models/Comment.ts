import mongoose, {Model} from "mongoose";
import {CommentFields} from "../types";

type CommentModel = Model<CommentFields>;

const Schema = mongoose.Schema;

const CommentSchema = new Schema<CommentFields, CommentModel>({
    text: {
        type: String,
        required: true,
    },
    recipe: {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Comment = mongoose.model<CommentFields, CommentModel>("Comment", CommentSchema);
export default Comment;

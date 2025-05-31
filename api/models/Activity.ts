import mongoose, {HydratedDocument,Types} from 'mongoose';
import {UserFields} from "../types";
import User from "./User";

export interface ActivityFields {
    title: string;
    description: string;
    image: string;
    author: Types.ObjectId | HydratedDocument<UserFields>;
    participants: Types.ObjectId[];
    isApproved: boolean;
}

const ActivitySchema = new mongoose.Schema<ActivityFields>({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    isApproved: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});


ActivitySchema.pre('deleteOne', {document: true}, async function() {
    await User.updateMany(
        {joinedActivities: this._id},
        {$pull: {joinedActivities: this._id}}
    );
});

const Activity = mongoose.model<ActivityFields>('Activity', ActivitySchema);
export default Activity;
import express from "express";
import {imagesUpload} from "../middleware/multer";
import auth, {RequestWithUser} from "../middleware/auth";
import Activity from "../models/Activity";
import permit from "../middleware/permit";
import User from "../models/User";
import {Types} from 'mongoose';

const activitiesRouter = express.Router();

activitiesRouter.get('/', async (req, res) => {
    try {
        const activities = await Activity.find({isApproved: true})
            .populate('author', 'displayName')
            .sort({createdAt: -1});
        res.send(activities);
    } catch (e) {
        res.status(500).send({error: 'Internal Server Error'});
    }
});

activitiesRouter.post('/', auth, imagesUpload.single('image'), async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;

        if (!req.file || !req.body.title || !req.body.description) {
            res.status(400).send({error: 'All fields are required'});
            return;
        }

        if (!req.file) {
            res.status(400).send({error: 'Image is required'});
            return;
        }

        const activity = new Activity({
            title: req.body.title,
            description: req.body.description,
            image: req.file.filename,
            author: user._id,
            isApproved: user.role === 'admin',
        });

        await activity.save();
        res.send(activity);
    } catch (e) {
        next(e);
    }
});

activitiesRouter.get('/:id', async (req, res) => {
    try {
        const activity = await Activity.findOne({
            _id: req.params.id,
            isApproved: true})
            .populate('author', 'displayName')
            .populate('participants', 'displayName');

        if (!activity) {
            res.status(404).send({error: 'Activity not found'});
            return
        }

        res.send(activity);
    } catch (e) {
        res.status(500).send({error: 'Internal Server Error'});
    }
});

activitiesRouter.post('/:id/participate', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            res.status(404).send({error: 'Activity not found'});
            return;
        }

        if (!activity.isApproved && user.role !== 'admin') {
            res.status(403).send({error: 'Activity not approved yet'});
            return;
        }

        const participantIndex = activity.participants.findIndex(
            (participantId) => participantId.toString() === user._id.toString()
        );
        const isParticipant = participantIndex !== -1;

        if (isParticipant) {
            activity.participants.splice(participantIndex, 1);
            await activity.save();

            await User.findByIdAndUpdate(user._id, {
                $pull: {joinedActivities: activity._id}
            });
        } else {
            activity.participants.push(user._id as Types.ObjectId);
            await activity.save();

            await User.findByIdAndUpdate(user._id, {
                $addToSet: {joinedActivities: activity._id}
            });
        }

        const updatedActivity = await Activity.findById(activity._id)
            .populate('author', 'displayName')
            .populate('participants', 'displayName');

        res.send(updatedActivity);
    } catch (e) {
        next(e);
    }
});

activitiesRouter.delete('/:id', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            res.status(404).send({error: 'Activity not found'});
            return;
        }

        if (activity.author.toString() !== user._id.toString() && user.role !== 'admin') {
            res.status(403).send({error: 'Not authorized'});
            return;
        }

        await activity.deleteOne();
        res.send({message: 'Activity deleted'});
    } catch (e) {
        next(e);
    }
});

activitiesRouter.patch('/:id/approve', auth, permit('admin'), async (req, res, next) => {
    try {
        const activity = await Activity.findByIdAndUpdate(
            req.params.id,
            {isApproved: req.body.approve},
            {new: true}
        );

        res.send(activity);
    } catch (e) {
        next(e);
    }
});

export default activitiesRouter;
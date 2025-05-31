import express from 'express';
import Activity from "../../models/Activity";

const adminActivitiesRouter = express.Router();

adminActivitiesRouter.get('/', async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate('author', 'displayName')
            .sort({createdAt: -1});
        res.send(activities);
    } catch (e) {
        res.status(500).send({error: 'Internal Server Error'});
    }
});

adminActivitiesRouter.patch('/:id/approve', async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(
            req.params.id,
            {isApproved: req.body.approve},
            {new: true}
        ).populate('author', 'displayName');

        if (!activity) {
            res.status(404).send({error: 'Activity not found'});
            return;
        }

        res.send(activity);
    } catch (e) {
        res.status(500).send({error: 'Internal Server Error'});
    }
});

adminActivitiesRouter.delete('/:id', async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);

        if (!activity) {
            res.status(404).send({error: 'Activity not found'});
            return;
        }

        res.send({message: 'Activity deleted'});
    } catch (e) {
        res.status(500).send({error: 'Internal Server Error'});
    }
});


export default adminActivitiesRouter;
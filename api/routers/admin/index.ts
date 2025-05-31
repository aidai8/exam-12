import express from "express";
import auth from "../../middleware/auth";
import permit from "../../middleware/permit";
import adminActivitiesRouter from "./activities";

const adminRouter = express.Router();

adminRouter.use(auth, permit('admin'))
adminRouter.use('/activities', adminActivitiesRouter);

export default adminRouter;
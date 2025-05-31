import express from "express";
import auth from "../../middleware/auth";
import permit from "../../middleware/permit";

const adminRouter = express.Router();

adminRouter.use(auth, permit('admin'))

export default adminRouter;
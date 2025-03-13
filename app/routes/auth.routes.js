import express from 'express';
import {signup, signin} from '../controllers/auth.controllers.js';
import {verifySignUp} from '../middlewares/index.js';


const router = express.Router();

//SIgnUp Route
router.post(
    '/signup',
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    signup
);

//Signin route
router.post('/signin', signin);

export default router;
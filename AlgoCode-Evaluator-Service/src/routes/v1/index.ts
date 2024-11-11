import express from 'express';
import { pingController } from '../../controller/pingController';
import submissionRouter from './submissionRoutes';

const v1Router = express.Router();

v1Router.use('/submissions', submissionRouter);
v1Router.get('/ping', pingController);

export default v1Router;
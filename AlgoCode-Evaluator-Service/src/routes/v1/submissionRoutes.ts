import express from 'express';
import { addSubmission } from '../../controller/submissionController';
import { validateDto } from '../../validators/zodValidator';
import { createSubmissionZodSchema } from '../../dtos/CreateSubmissionDto';

const submissionRouter = express.Router();

submissionRouter.post('/',
    validateDto(createSubmissionZodSchema),  // middleware
    addSubmission
);

export default submissionRouter;
import { Request, Response } from "express";
import { CreateSubmissionDto } from "../dtos/CreateSubmissionDto";

export function addSubmission(req: Request, res: Response){
    const submissionDto = req.body as CreateSubmissionDto;
    console.log("🚀 ~ addSubmission ~ submissionDto:", submissionDto);

    //TODO: Add validation using ZOD
    
    return res.status(201).json({
        success: true,
        error:{},
        message: "Successfully collected the submission",
        data: submissionDto,
    })
}
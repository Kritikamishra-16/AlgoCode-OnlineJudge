import { Job, Worker } from "bullmq";
import SubmissionJob from "../jobs/SubmissionJob";
import redisConnection from "../config/redisConfig";
import logger from "../config/loggerConfig";

// 2. this worker/consumer picks jobs from the queue call its corresponding handler
export default function SubmissionWorker(queueName: string){
    new Worker(
        queueName,
        async (job: Job)=>{
            if(job.name === "SubmissionJob"){
                logger.info("Job picked is ", job.name);
                const submissionJobInstance = new SubmissionJob(job.data);
                console.log("Calling job handler");
                submissionJobInstance.handler(job);
            }
        },{
            connection: redisConnection
        }
    );
}
import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/ExecutorFactory";
import { ExecutionResponse } from "../types/codeExecutorStrategy";
import evaluationQueueProducer from "../producers/evaluationQueueProducer";

export default class SubmissionJob implements IJob{
    name: string;
    payload: Record<string, SubmissionPayload>;
    constructor(payload: Record<string,SubmissionPayload>){
        this.name = this.constructor.name;
        this.payload= payload;
    }
    handler = async (job?: Job) =>{
        console.log("Handler of the job called");
        console.log(this.payload);
        if(job){
            const key = Object.keys(this.payload)[0];
            const codeLanguage = this.payload[key].language;
            const code = this.payload[key].code;
            const inputTestCase = this.payload[key].inputCase;
            const outputTestCase = this.payload[key].outputCase;
            // Applied STRATEGY PATTERN here to skip if else part for different languages
            const strategy = createExecutor(codeLanguage);
            if(strategy!== null){
                const response: ExecutionResponse = await strategy.execute(code, inputTestCase, outputTestCase);
                //add response to the Evaluation queue
                evaluationQueueProducer({response, userId: this.payload[key].userId, 
                    submissionId: this.payload[key].submissionId
                });
                if(response.status === "SUCCESS"){
                    console.log("Code executed successfully");
                    console.log(response);
                }else{
                    console.log("Something went wrong with code execution");
                    console.log(response);
                }
            }
        }
    }

    failed = (job?: Job) : void=>{
        console.log("Job failed");
        if(job){
            console.log(job.id);
        }
    }
}
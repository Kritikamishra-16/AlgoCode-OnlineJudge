import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";

export default class SampleJob implements IJob{
    name: string;
    payload?: Record<string, unknown>;
    constructor(payload: Record<string,unknown>){
        this.name = this.constructor.name;
        this.payload= payload;
    }
    handler = (job?: Job) =>{
        console.log("Handler of the job called");
        if(job){
            console.log(job.id,job.name,job.data);
        }
    }

    failed = (job?: Job) : void=>{
        console.log("Job failed");
        if(job){
            console.log(job.id);
        }
    }
}
//This producer should be present in seperate service as this service should only pick the submission jobs from queue 
// Ideally there should bbe another service that will add our submission requests into the queue

import submissionQueue from "../queues/submissionQueue";
import { SubmissionPayload } from "../types/submissionPayload";

//Record in ts is object in js
export default async function(payload: Record<string, SubmissionPayload>){
    await submissionQueue.add("SubmissionJob", payload);
    console.log("Successfully added a new submission job");
}
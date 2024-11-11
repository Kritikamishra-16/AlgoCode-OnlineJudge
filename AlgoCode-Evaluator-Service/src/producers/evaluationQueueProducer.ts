import evaluationQueue from "../queues/evaluationQueue";

//Record in ts is object in js
export default async function(payload: Record<string, unknown>){
    await evaluationQueue.add("EvaluationJob", payload);
    console.log("Successfully added a new evaluation job");
}
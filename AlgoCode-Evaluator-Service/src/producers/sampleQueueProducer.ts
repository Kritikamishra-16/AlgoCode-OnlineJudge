import sampleQueue from "../queues/sampleQueue";

// 1. this producer adds job into the queue
export default async function(name:string,payload: Record<string,unknown>, priority: number){
    await sampleQueue.add(name,payload, {priority});  //jobname , jobpayload
}
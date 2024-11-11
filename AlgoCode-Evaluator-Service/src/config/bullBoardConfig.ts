import { createBullBoard } from "@bull-board/api";
import {BullMQAdapter} from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import sampleQueue from "../queues/sampleQueue";
import SubmissionQueue from "../queues/submissionQueue";
import evaluationQueue from "../queues/evaluationQueue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ui');

createBullBoard({
    queues: [new BullMQAdapter(sampleQueue), new BullMQAdapter(SubmissionQueue), new BullMQAdapter(evaluationQueue)],
    serverAdapter,
});

export default serverAdapter;
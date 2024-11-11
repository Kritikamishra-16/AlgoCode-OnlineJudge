const { Worker } = require("bullmq");
const redisConnection = require('../config/redisConfig');
const axios = require('axios');
const axiosInstance = axios.create();

function evaluationWorker (queue){
    new Worker('EvaluationQueue', async job=>{
        if(job.name === 'EvaluationJob'){
            try{
                //Notifying socket service that submission have been evaluated
                const response = await axiosInstance.post('http://localhost:3003/sendPayload', {
                    userId: job.data.userId,
                    payload: job.data,
                });
                console.log(job.data);
                //TODO:Update the state of submission in DB
            }catch(error){
                console.log(error);
            }
        }
    },{
        connection: redisConnection
    });
}

module.exports = evaluationWorker;
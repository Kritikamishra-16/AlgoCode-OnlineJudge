const fastify = require('fastify')({ logger: true }) // calling the fastify constructor
//{logger:true} start putting relevant logs for every request you want to cater
const app = require('./app');
const connectToDB = require('./config/dbConfig');
const serverConfig= require('./config/serverConfig');
const evaluationWorker = require('./workers/evaluationWorker');

// fastify.get('/ping', (req, res)=>{
//     res.send({data: "Pong"});
// });


// registering plugin object with fastify object then automatically in the parameters
// app plugin will take the fastify object
fastify.register(app);


fastify.listen({port: serverConfig.PORT}, async (err)=>{
    if(err){
        fastify.log.error(err);
        process.exit(1);
    }
    await connectToDB();
    evaluationWorker("EvaluationQueue");
    console.log(`Server up at port ${serverConfig.PORT}`);
})
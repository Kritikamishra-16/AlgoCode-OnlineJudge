const fastifyPlugin= require('fastify-plugin');
const SubmissionService = require('./submissionService');

async function servicePlugin(fastify, options){
    // Inside the fastify object it decorate will add key 'submissionService'
    // and attach a SubmissionService object with it

    //we are passing this.submissionRepository bcz we have already decorated the fastify instance 
    // with submissionRepository -> Also registered submissionPlugin before servicePlugin in app.js
    fastify.decorate('submissionService', new SubmissionService(fastify.submissionRepository));
}

module.exports = fastifyPlugin(servicePlugin);
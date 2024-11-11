async function v1Plugin(fastify,options){
    // all the /test requests should go to testRoutes
    fastify.register(require('./submissionRoutes'), {prefix:'/submission'});
}

module.exports= v1Plugin;
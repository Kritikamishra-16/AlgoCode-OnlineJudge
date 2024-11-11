async function apiPlugin(fastify, options){
    // one more registery all the /v1 requests should go to v1Routes
    fastify.register(require('./v1/v1Routes'), {prefix:'/v1'});
}

module.exports= apiPlugin;
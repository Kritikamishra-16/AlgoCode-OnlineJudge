const fastifyPlugin = require('fastify-plugin');
const servicePlugin = require('./services/servicePlugin');
const repositoryPlugin = require('./repositories/repositoryPlugin');

/**
 * 
 * @param {Fastify object} fastify 
 * @param {*} options 
 */

async function app(fastify, options){
    // register fastify cors so that our server can accept all the incoming requestes from anywhere
    // if we want it to response to specific ip requests we can enable it here
    await fastify.register(require('@fastify/cors')); // enable use of CORS for fastify application using register plugin

    await fastify.register(repositoryPlugin);
    await fastify.register(servicePlugin);

    // register test route
    await fastify.register(require('./routes/api/apiRoutes'), {prefix:'/api'});  // all the api routes should be prefxed with /api
    
    
    // fastify.register(require('./routes/testRoutes'), {prefix: '/test'});
    //NOTE: If we are making this testRoute as plugin then only registering it
    // over here will work but this prefix will not work bcz now testRoute is
    // not route anymore it is a plugin
}

module.exports= fastifyPlugin(app); // now this app function becomes a fastify plugin
// When we register this plugin with fastify object , it will automatically execute the 
// app function 
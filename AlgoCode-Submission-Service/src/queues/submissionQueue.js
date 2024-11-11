const {Queue} = require('bullmq');
const redisConnection = require('../config/redisConfig');

// If submission queue will not exxist it will create brand new if it 
// exists it will keep/return it as it is
module.exports = new Queue('SubmissionQueue', {
    connection: redisConnection
});
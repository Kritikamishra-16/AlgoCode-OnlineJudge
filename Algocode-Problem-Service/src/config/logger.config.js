const winston = require('winston');
const { LOG_DB_URL } = require('./server.config');
require('winston-mongodb');

const allowedTransports = [];

// The below transport configuration enables logging on the console (transport)
allowedTransports.push(new winston.transports.Console({ // (THIS CONSOLE TRANSPORTS HAS ITS CUSTOM FORMAT )
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }), 
        winston.format.printf((log)=>`${log.timestamp} [${log.level}]: ${log.message}`)

    )
})); 


// The below transport configuration enables logging in the mongoDB database (transport)
allowedTransports.push(new winston.transports.MongoDB({
    level: 'error', // only error logs will go inside mongodb transport
    db: LOG_DB_URL, // db url
    collection: 'logs', //name of collection that contains all the logs 
}));


// The below transport configuration enables logging in the file
allowedTransports.push(new winston.transports.File({
    filename: `app.log`
}));


const logger = winston.createLogger({
    // FORMAT -> defines when the log is going to be printed on transports  how its gonna be printed, (THIS IS THE DEFAULT FORMAT FOR ALL TRANSPORTS)
    format: winston.format.combine(

        //this enable stack trace of the error
        winston.format.errors({stack: true}),

        // first argument to the combine method is defining how we want the timestamps to come up
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }), 
        //second argument to the combine method, which defines what is exactly going to be printed in logs, (level -> errorlog, info log, warning log, debug log)
        winston.format.printf((log)=>`${log.timestamp} [${log.level.toUpperCase()}]: ${log.message}`),
    ),
    transports: allowedTransports, // where all the logs can go -> console, file, db etc
});

module.exports = logger;
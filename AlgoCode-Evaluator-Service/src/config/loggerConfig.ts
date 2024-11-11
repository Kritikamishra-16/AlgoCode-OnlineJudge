import winston from 'winston';


const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.errors({stack:true}),
        winston.format.timestamp({
            format: 'YYYY:MM:DD HH:mm:ss'
        }),
        winston.format.printf((log)=>`${log.timestamp} [${log.level.toUpperCase()}]: ${log.message}`),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({
                    format: 'YYYY:MM:DD HH:mm:ss'
                }),
                winston.format.printf((log)=>`${log.timestamp} [${log.level}]: ${log.message}`)
            )
        })
    ],
});

export default logger;
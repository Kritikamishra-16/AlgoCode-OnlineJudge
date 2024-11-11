const BaseError = require("../errors/base.error");
const {StatusCodes} = require("http-status-codes");

//TODO: how come inside this middleware err is first param bcz generally inside middlewares we have req, req, next 
// Solution: because if any middleware takes 4 param err, req, res, next then it is errorHandler middleware not a normal middleware that is being executed at the end of middleware stack 
// and no matter where we register it in middleware stack chain it will be executed at last 
// if we don't create this express has its own built in errorHandler middleware

function errorHandler(err, req, res, next){ 
    //Polymorphism in below line-> allows objects of different types to be treated as if they are the same type, especially when they share common behaviors. It uses inheritance to let subclasses override or extend the behaviors of a parent class
    //instanceof operator checks whether err is an instance of BaseError or any class that extends BaseError.
    if(err instanceof BaseError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err.details || {},
            data: {} // because this an exception so no data is going  to be provided
        })
    } 

    logger.error(`Something went wrong`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
        error: err,
        data: {}
    })
}

// This is our custom error handler middleware if we would not have been created it express comes with built in error handler that take cares of any error that encounters

// that default express error handler is added at the end of the middleware function stack

module.exports = errorHandler;
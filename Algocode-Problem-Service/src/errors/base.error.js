class BaseError extends Error {
    constructor(name, statusCode, description, details){
        super(description); // calling the constructor of the Error(super) class
        this.name = name;
        this.statusCode = statusCode;
        this.details = details;

        // We don't need it here because we are already inheriting Error class so it automatically gets attached here
        // so this is mainly for attaching stack property with third object
        // Error.captureStackTrace(this); 
        // console.log(this.stack);
    }
}

module.exports = BaseError;
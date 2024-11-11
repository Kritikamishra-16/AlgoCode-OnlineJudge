import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from "express";


// HIGHER ORDER FUNCTION -> A Higher-Order Function (HOF) is a function that either:
// Takes one or more functions as arguments, or
// Returns a function as its result.
export const validateDto = ( schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction)=>{
    try {
        schema.parse({  
            ...req.body   // it validates body / payload to the zod schema 
        });
        next();
    } catch (error) {
        return res.status(404).json({
            success: false,
            data: {},
            message: "Invalid request params received",
            error: error
        });
    }
};
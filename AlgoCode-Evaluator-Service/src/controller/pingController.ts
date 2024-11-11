import { Request, Response } from "express";

export const pingController = (req: Request, res: Response)=>{
    console.log("🚀 ~ pingController ~ req:", req.url)
    return res.status(200).json({
        message: "Ping check ok",
    });
};
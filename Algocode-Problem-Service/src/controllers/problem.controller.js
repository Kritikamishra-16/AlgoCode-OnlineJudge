const NotImplementedError = require('../errors/notimplemented.error');
const {ProblemService} = require('../services');
const {ProblemRepository} = require('../repositories');
const { StatusCodes } = require('http-status-codes');

const problemService = new ProblemService(new ProblemRepository()); //DI- lose coupling -> any change in repository need not to change in service

function pingProblemController(req,res){
    return res.json({message:"Problem Controller is working"});
}

async function addProblem(req,res, next){
    try{
        const newProblem = await problemService.createProblem(req.body);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Successfully created a new problem",
            error: {},
            data: newProblem
        });
    }catch(error){
        next(error); // it will call last errorHandler middleware that we created
    }
}

async function getProblems(res,res, next){
    try{
        const response = await problemService.getAllProblems();
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully fetched all the problems",
            error:{},
            data: response
        });
    }catch(error){
        next(error); 
    }
}

async function getProblem(req,res, next){
    try{
        const problem = await problemService.getProblem(req.params.id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully fetched a problem",
            error: {},
            data: problem
        })
    }catch(error){
        next(error); 
    }
}

async function deleteProblem(req,res, next){
    try{
        const problem = await problemService.deleteProblem(req.params.id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully deleted a problem',
            error: {},
            data: problem? problem._id: ""
        })
    }catch(error){
        next(error); 
    }
}

async function updateProblems(req,res){
    try{
        const updatedProblem = await problemService.updateProblem(req.params.id, req.body);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully updated a problem',
            error: {},
            data: updatedProblem
        }) 
    }catch(error){
        next(error);
    }
}

module.exports = {
    addProblem,
    getProblem,
    getProblems,
    deleteProblem,
    updateProblems,
    pingProblemController
}

/**
 * res
 * 
 * res.status -> it returns the same res object with status property set
 * .json -> it will return the same res object with status set but this time json to be returned is also set 
 *
 */
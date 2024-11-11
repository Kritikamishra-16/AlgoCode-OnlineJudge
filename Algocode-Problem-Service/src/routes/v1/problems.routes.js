const express = require('express');
const {problemController} = require('../../controllers'); //no need to write index it will take index as default
const ProblemRouter = express.Router();

//If any request comes and route continues with /ping we map it to pingProblemController
// all these requests are being passed through a bunch of middlewares
ProblemRouter.get("/ping", problemController.pingProblemController);

ProblemRouter.get("/:id", problemController.getProblem);

ProblemRouter.get("/", problemController.getProblems);

ProblemRouter.post("/",problemController.addProblem);

ProblemRouter.delete('/:id',problemController.deleteProblem);

ProblemRouter.patch('/:id',problemController.updateProblems);


module.exports = ProblemRouter;


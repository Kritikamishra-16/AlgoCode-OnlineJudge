const express = require('express');
const ProblemRouter = require("./problems.routes");
const v1Router = express.Router();

//If any request comes and route continues with /problems we map it to ProblemsRouter
v1Router.use('/problems', ProblemRouter);

module.exports = v1Router;
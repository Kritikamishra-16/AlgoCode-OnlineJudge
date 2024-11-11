const logger = require('../config/logger.config');
const NotFoundError = require('../errors/notfound.error');
const {Problem} = require('../models');

class ProblemRepository {
    async createProblem(problemData){
        try{
            const problem = await Problem.create({
                title: problemData.title,
                description:  problemData.description,
                difficulty: problemData.difficulty,
                codeStubs: problemData.codeStubs,
                
                testCases: (problemData.testCases)? problemData.testCases: []
            });
            return problem;
        }catch(error){
            console.log(error);
            throw error;
        }
    }
    async getAllProblems(){
        try{
            const problems = await Problem.find({});
            return problems;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async getProblem(id){
        try{
            const problem = await Problem.findById(id);
            if(!problem) {
                throw new NotFoundError("Problem", id);
            }
            return problem;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async deleteProblem(id){
        try{
            const problem = await Problem.findByIdAndDelete(id); // shorthand for findByIdAndDelete({_id:id})
            if(!problem){
                logger.error(`Problem with id: ${id} not found in the db`);
                throw new NotFoundError("Problem", id);
            }
            return problem;
        } catch(error){
            console.log(error);
            throw error;
        }
    }

    async updateProblem(id, updatedData){
        try{
            const updatedProblem = await Problem.findByIdAndUpdate(
                id, updatedData, {new:true}
            );
            if(!updatedProblem){
                throw new NotFoundError("Problem", id);
            }
            return updatedProblem;
        }catch(error){
            console.log(error);
            throw error;
        }
    }
}

module.exports = ProblemRepository;
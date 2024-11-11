const sanitizeMarkdownContent = require("../utils/markdownSanitizer");

class ProblemService{

    // getting problemRepository property as a constructor - DEPENDENCY INJECTION
    //DI- lose coupling -> any change in repository need not to change in service
    // if we would have been using (new ProblemRepository()).getAllProblems() -> then it will be a tight coupling as suppose we need to change the repository so we need to change it here as well
    constructor(problemRepository){ //injecting problemRepository bcz in future we can change our problemRepository in case we need to use another db
        this.problemRepository= problemRepository;
    }

    async createProblem(problemData){
        //1.SAnitize the markdown for description
        problemData.description = sanitizeMarkdownContent(problemData.description);
        const problem = await this.problemRepository.createProblem(problemData);
        return problem;
    }

    async getAllProblems(){
        const problems = await this.problemRepository.getAllProblems();
        return problems;
    }

    async getProblem(problemId){
        const problem = await this.problemRepository.getProblem(problemId);
        return problem;
    }

    async deleteProblem(problemId){
        const deletedProblem = await this.problemRepository.deleteProblem(problemId);
        return deletedProblem;
    }

    async updateProblem(problemId, updatedData){
        const problem = await this.problemRepository.updateProblem(problemId, updatedData);
        return problem;
    }

}

module.exports = ProblemService;
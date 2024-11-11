const { fetchProblemDetails } = require('../apis/problemAdminApi');
const submissionProducer = require('../producers/submissionQueueProducer');
class SubmissionService{
    constructor(submissionRepository){
        this.submissionRepository = submissionRepository;
    }
    async pingCheck(){
        return "Pong";
    }

    async addSubmission(submissionPayload){
        //Hit the problem service and fetch the problem details
        const problemId = submissionPayload.problemId;
        const userId = submissionPayload.userId;
        const problemAdminServiceAPiResponse = await fetchProblemDetails(problemId);

        if(!problemAdminServiceAPiResponse){
            throw {message: "Not able to create submission"};
        }

        const languageCodeStub = problemAdminServiceAPiResponse.data.codeStubs.find(
            codeStub => codeStub.language.toLowerCase() === submissionPayload.language.toLowerCase()
        );

        submissionPayload.code = languageCodeStub.startSnippet + "\n\n" +
        submissionPayload.code + "\n\n" + languageCodeStub.endSnippet;
    
        // making a db entry for the submission payload
        const submission = await this.submissionRepository.createSubmission(submissionPayload);
        if(!submission){
            //TODO: Add error handling here
            throw {message: "Not able to create submission"};
        }
        console.log(submission);

        //adding submission payload inside queue through producer
        const response = await submissionProducer({
            [submission._id]:{
                code: submission.code,
                language: submission.language,
                inputCase: problemAdminServiceAPiResponse.data.testCases[0].input,
                outputCase: problemAdminServiceAPiResponse.data.testCases[0].output,
                userId,
                submissionId: submission._id
            }
        });
        //TODO: Add handling of all test cases 
        // we can either -> for each test case we can create new submission
        // or we can send all input and output test cases in 1 submission and handle in evaluator code
        return {
            queueResponse:response,
            submission
        };
    }
}

module.exports = SubmissionService;
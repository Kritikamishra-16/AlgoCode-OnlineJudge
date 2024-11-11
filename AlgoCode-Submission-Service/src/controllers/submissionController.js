
async function pingRequest(req, res){
    // every controller function has access to a fastify object
    console.log(this.testService); 
    const response = await this.testService.pingCheck();
    return res.send({data:response});
}


//TODO: Add validation layer
async function createSubmission(req, res){
    const response = await this.submissionService.addSubmission(req.body);
    return res.status(201).send({ // fastify doesn't have .json
        error:{},
        data: response,
        success: true,
        message: "Created submission successfully"
    })
}

module.exports = {
    pingRequest,
    createSubmission
}
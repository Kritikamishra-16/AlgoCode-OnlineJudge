// import Docker from "dockerode";

import createContainer from "./containerFactory";
// import { TestCases } from "../types/testCases";

import {PYTHON_IMAGE} from "../utils/constants"
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutorStrategy";

class PythonExecutor implements CodeExecutorStrategy {

    async execute(code: string, inputTestCase: string, outputTestCase:string): Promise<ExecutionResponse> {
        console.log("🚀 ~ runPython ~ inputTestCase:", inputTestCase, outputTestCase)
        const rawBuffer: Buffer[] = [];

        await pullImage(PYTHON_IMAGE);

        console.log("Initializing a new python docker container");

        //-c -> for running python3 code as string & stty -echo -> disable echoing of the characters you type on screen
        // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
        
        // ->Whatever our code string is we are going to convert all the single quotes with the double quotes 
        // and then create a python file out of irt and pass the input test case in file
        // ->We are creating afile as in cpp we need a file to compile it and run it
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
        const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
            '/bin/sh', // This specifies the shell that will interpret and run the command string (bash shell)
            '-c',
            runCommand
        ]);
        
        await pythonDockerContainer.start(); // booting the corresponding docker container

        console.log("Started the docker container");

        const loggerStream = await pythonDockerContainer.logs({
            stdout: true, // whether to include the output logs
            stderr:true,
            timestamps: false,
            follow: true, // whether the logs are streamed in real time or returned as a string
        });

        // Attach events on the stream object to start and stop reading
        loggerStream.on('data', (chunk)=>{
            // this chunk will be read -> the moment you are feeding the data in your docker container logs anything this event will be triggred ( whenever the input code will hace any logger/ print statements that will be read here)
            rawBuffer.push(chunk);
        });

        try{
            const codeResponse: string = await this.fetchDecodedStream(loggerStream, rawBuffer);
            if(codeResponse.trim() === outputTestCase.trim()){
                return { output: codeResponse, status: "SUCCESS" }
            }else {
                return { output: codeResponse, status: 'WA'}
            }
        }catch (error){
            if(error === "TLE"){
                await pythonDockerContainer.kill();
            }
            return {
                output: error as string,
                status: "ERROR"
            }
        } finally{
            // removed the container when done with it
            await pythonDockerContainer.remove();
        }

        
        // return codeResponse;
    }

    fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawBuffer: Buffer[]): Promise<string>{
        //TODO: May be move to the docker helper util

        return new Promise((res, rej)=>{

            const timeout = setTimeout(()=>{
                console.log("Timeout called");
                rej('TLE');
            }, 2000);

            loggerStream.on('end', ()=>{
                //This callback executes when the stream ends
                clearTimeout(timeout);
                console.log(rawBuffer); // array of buffers 
                const completeBuffer = Buffer.concat(rawBuffer); // it will create complete buffer object by concatinating all the chunks
                const decodedStream = decodeDockerStream(completeBuffer);
                console.log(decodedStream);
                if(decodedStream.stdout){
                    res(decodedStream.stdout);
                }else {
                    rej(decodedStream.stderr)
                }
            });
        });
    }
    
}

export default PythonExecutor;
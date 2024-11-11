import CodeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutorStrategy";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";


class JavaExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string, outputTestCase:string): Promise<ExecutionResponse> {
        console.log("🚀 ~ runJava ~ inputTestCase:", inputTestCase, outputTestCase)
        const rawLogBuffer: Buffer[] =[];

        await pullImage(JAVA_IMAGE);
        console.log("Initializing a new java docker container");
    
        // complile the file to get a byte code then you run the bytecode
        const runCommand =`echo '${code.replace(/'/g,`'\\"`)}' > Main.java  && javac Main.java && echo '${inputTestCase.replace(/'/g,`'\\"`)}' | java Main`;
    
        const javaDockerContainer = await createContainer(JAVA_IMAGE,[
            '/bin/bash',
            '-c',
            runCommand
        ]);
    
        await javaDockerContainer.start();
    
        const loggerStream = await javaDockerContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true,
        });
    
        loggerStream.on('data', (chunk)=>{
            rawLogBuffer.push(chunk);
        });
    
        try{
            const codeResponse: string = await this.fetchDecodedStream(loggerStream, rawLogBuffer);
            if(codeResponse.trim() === outputTestCase.trim()){
                return { output: codeResponse, status: "SUCCESS" }
            }else {
                return { output: codeResponse, status: 'WA'}
            }
        }catch (error){
            if(error === "TLE"){
                await javaDockerContainer.kill();
            }
            return {
                output: error as string,
                status: "ERROR"
            }
        } finally{
            // removed the container when done with it
            await javaDockerContainer.remove();
        }

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

export default JavaExecutor;
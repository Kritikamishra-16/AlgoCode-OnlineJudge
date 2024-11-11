import CodeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutorStrategy";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

class CppExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
        console.log("🚀 ~ runPython ~ inputTestCase:", inputTestCase, outputTestCase)
        const rawLogBuffer: Buffer[] =[];

        await pullImage(CPP_IMAGE);
        console.log("Initializing a new cpp docker container");

        // Manually trigger to clear the buffer 
        // stdbuf cmd will change the buffering operations of input output streams
        // oL set the standard out put to line buffer (line buffered stream -> data is accumulated into a buffer until a new line character is encountered)
        // eL set the error output to line buffer stream
        const runCommand =`echo '${code.replace(/'/g,`'\\"`)}' > main.cpp  && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g,`'\\"`)}' | ./main`;

        const cppDockerContainer = await createContainer(CPP_IMAGE,[
            '/bin/bash',
            '-c',
            runCommand
        ]);

        await cppDockerContainer.start();

        const loggerStream = await cppDockerContainer.logs({
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
                await cppDockerContainer.kill();
            }
            return {
                output: error as string,
                status: "ERROR"
            }
        } finally{
            // removed the container when done with it
            await cppDockerContainer.remove();
        }
    }

    fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawBuffer: Buffer[]): Promise<string>{

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


export default CppExecutor;
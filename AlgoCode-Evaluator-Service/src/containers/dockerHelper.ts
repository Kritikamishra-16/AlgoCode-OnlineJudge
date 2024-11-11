import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

export default function decodeDockerStream(buffer: Buffer): DockerStreamOutput{
    // This variable will keep track of the current position in the buffer while parsing
    let offset = 0; 

    // The output that will store the accumulated stdout and stderr output as string
    const output: DockerStreamOutput = { stdout: '', stderr: ''};

    // loop until offset reaches end of the buffer
    while(offset< buffer.length){

        // channel is read from buffer and has value of type of stream it is basically header of buffer (chunk)
        const typeOfStream = buffer[offset];

        // This length variable holds the length of the value/data
        // We will read this variable on an offset of 4 bytes start of the chunk
        // header size =8 ( 4 bytes type of chunk, 4 bytes length of data)
        // so we moved 4 to get the  length of data
        const length = buffer.readUInt32BE(offset+ 4);

        // Now we have read the header we can read the value of the chunk as size of header is 8 bytes so if we move 8 bytes forward we will reach to the value of buffer
        offset+=DOCKER_STREAM_HEADER_SIZE;

        if(typeOfStream === 1){
            // stdout stream
            output.stdout+= buffer.toString('utf-8', offset, offset+ length); 
            // starting and ending point where you have to read the data
        } else if(typeOfStream ===2){
            // stderr stream
            output.stderr+= buffer.toString('utf-8', offset, offset+length);
        }

        offset+= length; // move offset to next chunk

    }
    return output;
}
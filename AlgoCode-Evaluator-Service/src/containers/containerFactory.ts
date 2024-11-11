import Docker from 'dockerode';

async function createContainer(imageName: string, cmdExecutable: string[]){  // cmdExecutable-> cmd that we are going to execute in docker container
    const docker = new Docker();

    const container = await docker.createContainer({
        Image: imageName,
        Cmd: cmdExecutable,
        AttachStdin: true, // so that we have a standard input stream connected
        AttachStdout: true, // to enable output streams
        AttachStderr: true, // to enable error streams
        Tty: false,
        HostConfig:{ // this memory param make sure that if docker environment is taking up more memory it will throw error
            Memory: 1024*1024*512, // 512 MB
        },
        OpenStdin: true, //make sure that input stream is open even no interaction there
    });
    return container;

}

export default createContainer;
import Docker from 'dockerode';

export default async function pullImage(imageName: string) {
    try {
        const docker = new Docker();
        return new Promise((res, rej) => {
            docker.pull(imageName, (err: Error, stream: NodeJS.ReadableStream) => {
                if(err) throw err;
                // followProgress show us the downloading progress of image
                docker.modem.followProgress(stream, (err, response) => err ? rej(err) : res(response), (event) => { // error happens then reject the promise else resolve
                    console.log(event.status); // everytime there is progress this event is going to be triggered
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
}
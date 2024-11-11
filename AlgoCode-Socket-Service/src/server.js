const express = require('express'); // Import express
const {createServer} = require('http'); // Import http
const {Server} = require("socket.io"); // Import socket.io
const Redis = require('ioredis');
const bodyParser = require('body-parser');

const app = express(); // Create express app
const httpServer = createServer(app); // Create http server using express app
const redisCache = new Redis(); // Create Redis client
app.use(bodyParser.json());

const io = new Server(httpServer, {
    //CORS - determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.
    //Preflight request - browser sends this to check if the cors has been successfully setup or not
    cors: {
        origin: "http://localhost:5500",
        methods: ["GET", "POST"]
    }
}); // Create socket.io server

io.on("connection", (socket)=>{
    console.log("A new user connected ", socket.id);

    socket.on('setUserId', (userId)=>{
        redisCache.set(userId, socket.id);
    });

    socket.on('getConnectionId', async (userId)=>{
        const connectionId = await redisCache.get(userId);
        socket.emit('connectionId', connectionId);
        const allConnections = await redisCache.keys('*');
        // console.log(allConnections);
    });
});

app.post('/sendPayload', async (req,res) => {
    const {userId, payload} = req.body;
    	if(!userId || !payload){
        	res.status(400).send('Invalid request');
    	}
    	const socketId = await redisCache.get(userId);
    	if(socketId){
        	//only emit the payload to the specific socket connection
        	io.to(socketId).emit('submissionPayloadResponse', payload);
        	res.send("Payload sent successfully!");
    	}else{
        	res.status(404).send("User not connected");
    	}
	});

httpServer.listen(3003, ()=>{
    console.log("Server is up on port 3003");
});
const mongoose = require('mongoose');
const { NODE_ENV, ATLAS_DB_URL } = require('./server.config');

// async function connectToDB(){
//     try{
//         if(NODE_ENV== "development"){
//             await mongoose.connect(ATLAS_DB_URL);
//         }
//     }catch(error){
//         console.log('Unable to connect to the DB server');
//         console.log(error);
//     }
// }

// SINGLETON CLASS IMPLEMENTATION

let instance; //stored db instance
class DBConnection{
    #isConnected; // private variable so that no one can access it from its object

    constructor(db_uri){
        if(instance){
            // if the instance variable already has a value
            throw new Error("Only one connection can exist");
        }
        this.uri = db_uri;
        instance = this;  // "this" is the current object that will be created once the constructor has been called
        this.#isConnected = false;
    }

    async connect(){
        if(this.#isConnected){
            throw new Error("DB already connected");
        }
        if(NODE_ENV == "development"){
            await mongoose.connect(ATLAS_DB_URL);
            this.#isConnected = true;
        }
    }

    async disconnect(){
        this.#isConnected = false;
    }

}

//Freezing an object means preventing extensions and makes existing properties non-writeable and non-configurable
const db = Object.freeze(new DBConnection());


module.exports = db;
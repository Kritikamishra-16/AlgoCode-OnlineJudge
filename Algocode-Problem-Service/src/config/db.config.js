const mongoose = require('mongoose');
const { NODE_ENV, ATLAS_DB_URL } = require('./server.config');

async function connectToDB(){
    try{
        if(NODE_ENV== "development"){
            await mongoose.connect(ATLAS_DB_URL);
        }
    }catch(error){
        console.log('Unable to connect to the DB server');
        console.log(error);
    }
}

module.exports = connectToDB;
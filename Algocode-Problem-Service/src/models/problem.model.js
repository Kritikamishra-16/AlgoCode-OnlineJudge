const mongoose = require("mongoose");

const {Schema} = mongoose; // Schema function (or constructor) that mongoose object will give us inside this constructor we can pass an object which contains all the properties that we need


// schema is a logical view of how your collections look like
const problemSchema = new Schema({
    title:{
        type: String,
        required: [true, 'Title cannot be empty']
    },
    description:{
        type: String,
        required : [true, 'Description cannot be empty']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: [true, 'Difficulty cannot be empty'],
        default: 'easy'
    },
    testCases: [ // custom test cases are not stored in db
        {
            input:{
                type: String,
                required: true
            },
            output:{
                type: String,
                required: true
            }
        }
    ],
    codeStubs:[ // array of objects based on languages
        { //for each language we are going to persist start and end stub
            language:{
                type: String,
                enum: ["CPP", "JAVA", "PYTHON"],
                required: true
            },
            startSnippet: {
                type: String,
                required: true,
            },
            endSnippet: {
                type: String,
            },
            userSnippet:{
                type: String,
                required:true,
            }
        }
    ],
    editorial:{
        type: String
    }
});

//mongoose model is an object using which we can query mongoDb for particular collection

const Problem = mongoose.model('Problem', problemSchema); // params - collectionName, schema: that mongoose will constantly validate over this collection

module.exports = Problem;
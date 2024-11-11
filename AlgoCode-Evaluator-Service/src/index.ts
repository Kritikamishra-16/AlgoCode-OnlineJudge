import express, {Express} from 'express';
import serverConfig from './config/serverConfig';
import apiRouter from './routes';
// import submissionQueueProducer from './producers/submissionQueueProducer';
import SubmissionWorker from './workers/submissionWorker';
import bullBoardAdapter from './config/bullBoardConfig';

import bodyParser from "body-parser";
// import runCpp from './containers/runCppDocker';
import { submission_queue } from './utils/constants';


const app: Express = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/api', apiRouter);
app.use('/ui', bullBoardAdapter.getRouter());


app.listen(serverConfig.PORT, ()=>{
    console.log(`Server started at *:${serverConfig.PORT}`);
    console.log(`BullBoard dashboard up at http://localhost:${serverConfig.PORT}/ui`)
    SubmissionWorker(submission_queue);

    // const code =`
    // #include<bits/stdc++.h>
    // using namespace std;

    // int main(){
    //     int x;
    //     cin>>x;
    //     cout<<"value of x is :"<<x<<endl;
    //     for(int i=0;i<x;i++){
    //         cout<<i<<" ";
    //     }
    //     return 0;    
    // }
    // `;
    // const inputCase = `10`;
    // const outputCase = `100`;

    // submissionQueueProducer({
    //     "1234": {
    //         language: "CPP",
    //         inputCase,
    //         outputCase,
    //         code 
    //     }
    // })

    // sampleQueueProducer('SampleJob',{
    //     name: "Kritika Mishra1",
    //     company: "Reliance Jio",
    //     position: "SDE1",
    //     location: "HYD"
    // }, 7);
    // sampleQueueProducer('SampleJob',{
    //     name: "Kritika Mishra",
    //     company: "Reliance Jio",
    //     position: "SDE1",
    //     location: "HYD"
    // }, 1);

//     const code = `x = input()
// y= input()    
// print("value of x is ", x)
// print("value of y is ", y)
// for i in range(int(x)):
//     print(i)
// `;
//     const inputCase = `100
// 200`
//     runPython(code, inputCase);


    // const code =`
    // import java.util.*;
    // public class Main {
    //     public static void main(String[] args){
    //         Scanner scn = new Scanner(System.in);
    //         int input = scn.nextInt();
    //         System.out.println("input value given by user: "+ input);
    //         for(int i=0;i<input;i++){
    //             System.out.println(i);
    //         }
    //     }
    // }
    // `;
    // const inputCase = `10`;
    // runJava(code, inputCase);


});

import express from 'express';
import {emailqueue} from './queue.js';
const app=express();
app.use(express.json());
app.post('/welocome-email',(req,res)=>{
    const job=emailqueue.add('send-welcome-email',{to:req.body.to,subject:req.body.name||'Learner'},{attempts:3,backoff:{type:'exponential',delay:5000}});

})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
} )
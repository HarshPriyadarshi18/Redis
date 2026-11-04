import express from 'express';
import Redis from 'ioredis';
const app=express();
app.use(express.json());
const redis=new Redis(process.env.REDIS_URL||'redis://localhost:6379');
const queue_key='queue:emails';
app.post('/emails',async(req,res)=>{
    const job={
        to:req.body.to,
        subject:req.body.subject,
        createdAt:new Date().toISOString()
    }
    await redis.lpush(queue_key,JSON.stringify(job));
    res.json({queued:true,job});
});
app.get('/emails/process',async(req,res)=>{
    const rawjob=await redis.rpop(queue_key);
    if(!rawjob){
        return res.json({message:'no job in queue'});
    }
    const job=JSON.parse(rawjob);
    res.json({message:'email sent',job});
});
app.listen(3000,()=>{
    console.log("server isrunning");
});
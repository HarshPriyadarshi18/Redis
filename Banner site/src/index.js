import express from 'express';
import Redis from 'ioredis';

const app=express();
app.use(express.json());
const redis=new Redis(process.env.REDIS_URL||'redis://localhost:6379');
const BANNER_KEY='app:banner';

app.post('/banner',async(req,res)=>{
    await redis.set(BANNER_KEY,req.body.message||"welcome to our site");
    res.json({message:"Banner updated successfully"});
});

app.get('/banner',async(req,res)=>{
    const message=await redis.get(BANNER_KEY);
    res.json({message:message||"welcome to our site"});
});
app.delete("/banner",async(req,res)=>{
    await redis.del(BANNER_KEY);
    res.json({message:"Banner deleted successfully"});
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
import express from 'express';
import Redis from 'ioredis';

const app=express();
app.use(express.json());
const redis=new Redis(process.env.REDIS_URL||'redis://localhost:6379');
function otpkey(phone){
    return `otp:${phone}`;
}
app.post('/otp',async(req,res)=>{
    const {phone}=req.body;
    const otp=Math.floor(100000+Math.random()*900000).toString();
    await redis.set(otpkey(phone),otp,'EX',300);
    res.json({message:"OTP sent successfully",otp});    

}) ;
app.post('/verify',async(req,res)=>{
    const {phone,otp}=req.body;
    const storedOtp=await redis.get(otpkey(phone));
    if(!storedOtp){
        return res.status(400).json({message:"OTP expired or not found"});
    }
    if(storedOtp!==otp){
        return res.status(400).json({message:"Invalid OTP"});
    }
    if(storedOtp===otp){
        await redis.del(otpkey(phone));
        res.json({message:"OTP verified successfully"});
    }
});
//how to know ttl of any phone no. otp
app.get('/otp/:phone/ttl',async(req,res)=>{
    const ttl=await redis.ttl(otpkey(req.params.phone));
    res.json({ttl});
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
}); 
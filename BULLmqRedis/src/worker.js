import {Worker} from 'bullmq';
import { connection,emailqueue} from './queue.js';
const worker=new Worker('emailqueue',
    async(job)=>{
        console.log("processing job",job.id,job.name,job.data);
        (await new Promise((resolve)=>setTimeout(resolve,5000)));
        console.log("job completed",job.id,job.name,job.data);
    },
  {connection}
)
//listen for events
worker.on('completed',(job)=>{
    console.log(`Job ${job.id} has completed`);
})
worker.on('failed',(job,err)=>{
    console.log(`Job ${job.id} has failed with error ${err.message}`);
})

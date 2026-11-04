import{Queue} from 'bullmq';
const connection={
    host:'localhost',
    Port:6379
}
const emailqueue=new Queue('email',{connection});
module.exports={
    emailqueue,
    connection
};
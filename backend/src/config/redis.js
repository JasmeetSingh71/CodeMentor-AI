const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-16578.c264.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 16021
    }
});

module.exports=redisClient;
const redis=require('redis')
const client = redis.createClient({
    password: 'MHNBgRgXXhGxZJ7ymOkBugFhBdUozx38',
    socket: {
        host: 'redis-16553.c251.east-us-mz.azure.cloud.redislabs.com',
        port: 16553
    }
});

client.connect();
client.on('connect', function() {
    console.log('Redis connected successfully');
});

client.on('error', function (err) {
    console.log('Error: ' + err);
});

module.exports=client;

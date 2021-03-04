require('dotenv').config();
const amqp = require('amqplib');
const argv = process.argv.slice(2);
if (argv.length === 0) {
    process.exit();
}

const { Deployment, DeploymentLog } = require('../common/db');

async function start(queueName) {
    const conn = await amqp.connect(process.env.RABBITMQ_HOST);
    const channel = await conn.createChannel();
    await channel.assertQueue(queueName);
    channel.prefetch(1);
    let Job = require(`./${queueName}`);
    console.log('waiting jobs..');
    channel.consume(queueName, async (message) => {
        console.log('New Job', Buffer.from(message.content).toString());
        try {
            await (new Job(message)).run();
        } catch (e) {
            console.log(e);
        }
        channel.ack(message);
    });
}

start(argv[0]);
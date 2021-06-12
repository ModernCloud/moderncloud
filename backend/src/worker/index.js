require('dotenv').config();
const amqp = require('amqplib');
const WorkerTask = require('./worker_task');

async function run() {
    const conn = await amqp.connect(process.env.RABBITMQ_HOST);
    const channel = await conn.createChannel();
    await channel.assertQueue('worker');
    channel.prefetch(20);
    channel.consume('worker', async (message) => {
        let workerTask;
        try {
            let jobMessage = JSON.parse(Buffer.from(message.content).toString());
            workerTask = await WorkerTask.factory(jobMessage);
            await workerTask.run();
        } catch (e) {
            if (workerTask instanceof WorkerTask) {
                await workerTask.updateTaskStatus(2);
            }
            console.log(e);
        }
        channel.ack(message);
    });
}

run();
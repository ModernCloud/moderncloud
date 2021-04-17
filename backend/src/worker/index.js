require('dotenv').config();
const path = require('path');
const amqp = require('amqplib');
const { Task } = require('../common/db');

async function run() {
    const conn = await amqp.connect(process.env.RABBITMQ_HOST);
    const channel = await conn.createChannel();
    await channel.assertQueue('worker');
    channel.prefetch(1);
    channel.consume('worker', async (message) => {
        try {
            let json = JSON.parse(Buffer.from(message.content).toString());
            let task = await Task.query().where('id', json.task_id).first();
            if (!(task instanceof Task)) {
                throw new Error(`Task not found: ${json.task_id}`);
            }
            let Job = require(path.join(__dirname, task.name));
            await (new Job(task, json)).run();
        } catch (e) {
            console.log(e);
        }
        channel.ack(message);
    });
}

run();
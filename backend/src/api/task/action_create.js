const moment = require('moment');
const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const amqp = require('amqplib');
const { Environment, Task } = require('../../common/db');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadEnvironment();
        await this.createTask();
        await this.sendToQueue();
        return this.response.success({id: this.task.id}, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            environment_id: Joi.number().required()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async loadEnvironment() {
        this.environment = await Environment.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .where('id', this.validRequest.environment_id)
            .first();
        if (!(this.environment instanceof Environment)) {
            throw new ApiError('Environment not found!', 10504, 404);
        }
    }

    async createTask() {
        if (['deploy', 'destroy'].indexOf(this.req.params.task_name) === -1) {
            throw new ApiError('Task not found!', 10517, 404);
        }
        let currentDatetime = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        this.task = await Task.query().insert({
            name: this.req.params.task_name,
            created_at: currentDatetime,
            updated_at: currentDatetime,
            params: JSON.stringify({
                user_id: this.currentUser.id,
                project_id: this.validRequest.project_id,
                environment_id: this.validRequest.environment_id
            })
        });
    }

    async sendToQueue() {
        let conn = await amqp.connect(process.env.RABBITMQ_HOST);
        let channel = await conn.createChannel();
        await channel.assertQueue('worker');
        let sendResult = await channel.sendToQueue('worker', Buffer.from(JSON.stringify({
            task_id: this.task.id
        })));
        if (sendResult === false) {
            await new Promise((resolve) => channel.once('drain', () => resolve));
        }
        await channel.close();
        await conn.close();
    }
}

module.exports = CreateAction;
const moment = require('moment');
const Joi = require('joi');
const amqp = require('amqplib');
const ApiAction = require('../action');
const { Deployment } = require('../../common/db');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.createDeployment();
        await this.sendToQueue();
        return this.response.success({id: this.deployment.id}, 201);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            environment_id: Joi.number().required()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createDeployment() {
        let currentDatetime = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        this.deployment = await Deployment.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            environment_id: this.validRequest.environment_id,
            created_at: currentDatetime,
            updated_at: currentDatetime,
        });
    }

    async sendToQueue() {
        let conn = await amqp.connect(process.env.RABBITMQ_HOST);
        let channel = await conn.createChannel();
        await channel.assertQueue('deployer');
        let sendResult = await channel.sendToQueue('deployer', Buffer.from(JSON.stringify({
            deployment_id: this.deployment.id
        })));
        if (sendResult === false) {
            await new Promise((resolve) => channel.once('drain', () => resolve));
        }
        await channel.close();
        await conn.close();
    }
}

module.exports = CreateAction;
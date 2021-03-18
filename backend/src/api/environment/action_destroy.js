const ApiAction = require('../action');
const ApiError = require('../error');
const amqp = require('amqplib');
const { Environment } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
        await this.sendToQueue();
        return this.response.success({}, 200);
    }

    async loadEnvironment() {
        this.environment = await Environment.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.environment instanceof Environment)) {
            throw new ApiError('Environment not found!', 10504, 404);
        }
    }

    async sendToQueue() {
        let conn = await amqp.connect(process.env.RABBITMQ_HOST);
        let channel = await conn.createChannel();
        await channel.assertQueue('destroyer');
        let sendResult = await channel.sendToQueue('destroyer', Buffer.from(JSON.stringify({
            environment_id: this.environment.id
        })));
        if (sendResult === false) {
            await new Promise((resolve) => channel.once('drain', () => resolve));
        }
        await channel.close();
        await conn.close();
    }
}

module.exports = GetAction;
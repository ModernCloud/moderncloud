const Joi = require('joi');
const ApiAction = require('../action');
const { Dynamodb } = require('../../common/db');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.createTable();
        return this.response.success({id: this.table.id}, 201);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            name: Joi.string().required().label('Name'),
            read_capacity: Joi.number().required().label('Read Capacity'),
            write_capacity: Joi.number().required().label('Write Capacity'),
            hash_key: Joi.string().required().label('Hash Key'),
            range_key: Joi.string().optional().allow(null, '').label('Range Key'),
            attributes: Joi.array().required().label('Attributes')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createTable() {
        this.table = await Dynamodb.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            name: this.validRequest.name,
            read_capacity: this.validRequest.read_capacity,
            write_capacity: this.validRequest.write_capacity,
            hash_key: this.validRequest.hash_key,
            range_key: this.validRequest.range_key,
            attributes: JSON.stringify(this.validRequest.attributes)
        });
    }
}

module.exports = CreateAction;
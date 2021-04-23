const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Dynamodb } = require('../../common/db');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.checkTableName();
        await this.createTable();
        return this.response.success({id: this.table.id}, 201);
    }

    async validateParams() {
        let namePattern = new RegExp('^[a-zA-Z0-9\\_\\-\\.]{3,255}$');
        let schema = Joi.object({
            project_id: Joi.number().required(),
            name: Joi.string().pattern(namePattern).required().label('Name'),
            read_capacity: Joi.number().required().label('Read Capacity'),
            write_capacity: Joi.number().required().label('Write Capacity'),
            hash_key: Joi.string().pattern(namePattern).min(3).max(255).required().label('Hash Key'),
            range_key: Joi.string().pattern(namePattern).min(3).max(255).optional().allow(null, '').label('Range Key'),
            attributes: Joi.array().items(Joi.object({
                name: Joi.string().pattern(namePattern).required(),
                type: Joi.string().required().allow('S', 'N', 'B')
            })).required().label('Attributes')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
        let hasHashKey = false;
        let hasRangeKey = false;
        for (const attribute of this.validRequest.attributes) {
            if (attribute.name === this.validRequest.hash_key) {
                hasHashKey = true;
            }
            if (attribute.name === this.validRequest.range_key) {
                hasRangeKey = true;
            }
        }
        if (hasHashKey === false) {
            throw new ApiError('Please add an attribute for Hash Key.', 10518, 400);
        }
        if (hasRangeKey === false && this.validRequest.range_key) {
            throw new ApiError('Please add an attribute for Range Key.', 10519, 400);
        }
        if (this.validRequest.hash_key === this.validRequest.range_key) {
            throw new ApiError('You cannot use same attribute name for Hash Key and Range Key.', 10520, 400);
        }
    }

    async checkTableName() {
        let row = await Dynamodb.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .where('name', this.validRequest.name)
            .first();
        if (row instanceof Dynamodb) {
            throw new ApiError('The table name already exists. Please choose a different name.', 10521, 400);
        }
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
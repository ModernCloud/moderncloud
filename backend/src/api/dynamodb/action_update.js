const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Dynamodb } = require('../../common/db');

class UpdateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadTable();
        await this.checkTableName();
        await this.updateTable();
        return this.response.success({}, 200);
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

    async loadTable() {
        this.table = await Dynamodb.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.table instanceof Dynamodb)) {
            throw new ApiError('Dynamodb table not found!', 10510, 404);
        }
    }

    async checkTableName() {
        let row = await Dynamodb.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .where('name', this.validRequest.name)
            .where('id', '!=', this.table.id)
            .first();
        if (row instanceof Dynamodb) {
            throw new ApiError('The table name already exists. Please choose a different name.', 10521, 400);
        }
    }

    async updateTable() {
        let updateParams = {};
        if (this.validRequest.read_capacity) {
            updateParams.read_capacity = this.validRequest.read_capacity;
        }
        if (this.validRequest.write_capacity) {
            updateParams.write_capacity = this.validRequest.write_capacity;
        }
        if (this.validRequest.hash_key) {
            updateParams.hash_key = this.validRequest.hash_key;
        }
        if (this.validRequest.range_key) {
            updateParams.range_key = this.validRequest.range_key;
        }
        if (this.validRequest.attributes) {
            updateParams.attributes = JSON.stringify(this.validRequest.attributes);
        }
        if (Object.keys(updateParams).length > 0) {
            await Dynamodb.query().where('id', this.table.id).update(updateParams);
        }
    }
}

module.exports = UpdateAction;
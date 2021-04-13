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
        await this.updateTable();
        return this.response.success({}, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            name: Joi.string().optional().label('Name'),
            read_capacity: Joi.number().optional().label('Read Capacity'),
            write_capacity: Joi.number().optional().label('Write Capacity'),
            hash_key: Joi.string().optional().label('Hash Key'),
            range_key: Joi.string().optional().label('Range Key'),
            attributes: Joi.array().optional().label('Attributes')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
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
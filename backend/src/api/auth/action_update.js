const Joi = require('joi');
const bcrypt = require('bcryptjs');
const ApiAction = require('../action');
const { User } = require('../../common/db');

class UpdateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.updateUser();
        return this.response.success({
            user: {
                id: this.currentUser.id,
                name: this.currentUser.name,
                email: this.currentUser.email
            }
        }, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            name: Joi.string().optional().label('Name'),
            email: Joi.string().email().optional().label('Email'),
            password: Joi.any().optional().label('Password')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async updateUser() {
        let updateParams = {};
        if (this.validRequest.name) {
            updateParams.name = this.validRequest.name;
            this.currentUser.name = this.validRequest.name;
        }
        if (this.validRequest.email) {
            updateParams.email = this.validRequest.email;
            this.currentUser.email = this.validRequest.email;
        }
        if (this.validRequest.password) {
            updateParams.password = bcrypt.hashSync(this.validRequest.password, 10);
        }
        if (Object.keys(updateParams).length > 0) {
            await User.query().where('id', this.currentUser.id).update(updateParams);
        }
    }
}

module.exports = UpdateAction;
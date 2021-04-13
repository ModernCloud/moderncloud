const Joi = require('joi');
const bcrypt = require('bcryptjs');
const JWT = require('../jwt');
const ApiAction = require('../action');
const ApiError = require('../error');
const { User } = require('../../common/db');

class GenerateToken extends ApiAction
{
    async tryExecute() {
        await this.validateParams();
        await this.loadUser();
        await this.validatePassword();
        await this.createToken();
        return this.response.success({
            token: this.token,
            user: {
                id: this.user.id,
                name: this.user.name,
                email: this.user.email
            }
        }, 201);
    }

    async validateParams() {
        let schema = Joi.object({
            email: Joi.string().email().required().label('Email'),
            password: Joi.string().min(6).required().label('Password')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async loadUser() {
        this.user = await User.query().where({'email': this.validRequest.email}).first();
        if (!(this.user instanceof User)) {
            throw new ApiError('Wrong email or password', 10501, 404);
        }
    }

    async validatePassword() {
        if (bcrypt.compareSync(this.validRequest.password, this.user.password) === false) {
            throw new ApiError('Wrong email or password', 10501, 404);
        }
    }

    async createToken() {
        this.token = JWT.generate({id: this.user.id, email: this.user.email, name: this.user.name});
    }
}

module.exports = GenerateToken;
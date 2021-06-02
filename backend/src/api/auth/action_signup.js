const Joi = require('joi');
const bcrypt = require('bcryptjs');
const JWT = require('../jwt');
const ApiAction = require('../action');
const ApiError = require('../error');
const { User } = require('../../common/db');
const setupDefaultResources = require('./setup_default_resources');
const createStripeCustomer = require('./create_stripe_customer');

class SignupAction extends ApiAction
{
    async tryExecute() {
        await this.validateParams();
        this.transaction = await User.startTransaction();
        try {
            await this.checkUserExists();
            await this.createUser();
            await this.createToken();
            await setupDefaultResources(this.transaction, this.user);
            if (process.env.BILLING_ENABLED) {
                await createStripeCustomer(this.transaction, this.user);
            }
            await this.transaction.commit();
        } catch (err) {
            await this.transaction.rollback();
            throw err;
        }
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
            password: Joi.string().min(6).required().label('Password'),
            name: Joi.string().required().label('Name')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async checkUserExists() {
        let user = await User.query(this.transaction).findOne({'email': this.validRequest.email});
        if (user instanceof User) {
            throw new ApiError('User already exists!', 10500, 400);
        }
    }

    async createUser() {
        this.user = await User.query(this.transaction).insert({
            email: this.validRequest.email,
            password: bcrypt.hashSync(this.validRequest.password, 10),
            name: this.validRequest.name
        });
    }

    async createToken() {
        this.token = JWT.generate({id: this.user.id, email: this.user.email, name: this.user.name});
    }
}

module.exports = SignupAction;
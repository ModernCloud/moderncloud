const Joi = require('joi');
const JWT = require('../jwt');
const ApiAction = require('../action');
const { User } = require('../../common/db');
const {OAuth2Client} = require('google-auth-library');
const googleOAuth2Client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);
const setupDefaultResources = require('./setup_default_resources');
const createStripeCustomer = require('./create_stripe_customer');

class GenerateToken extends ApiAction
{
    async tryExecute() {
        await this.validateParams();
        await this.loadGoogleUser();
        await this.loadUser();
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
            id_token: Joi.string().required()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async loadGoogleUser() {
        let decodedIdToken = await googleOAuth2Client.verifyIdToken({
            idToken: this.validRequest.id_token,
            audience: process.env.GOOGLE_OAUTH_CLIENT_ID
        });
        this.googleUser = decodedIdToken.getPayload();
    }

    async loadUser() {
        this.user = await User.query().where({'email': this.googleUser.email}).first();
        if (!(this.user instanceof User)) {
            await this.createUserIfNotExists();
        }
    }

    async createUserIfNotExists() {
        this.transaction = await User.startTransaction();
        try {
            this.user = await User.query().insert({
                email: this.googleUser.email,
                password: '',
                name: this.googleUser.name
            });
            await setupDefaultResources(this.transaction, this.user);
            await createStripeCustomer(this.transaction, this.user);
            await this.transaction.commit();
        } catch (err) {
            await this.transaction.rollback();
            throw err;
        }
    }

    async createToken() {
        this.token = JWT.generate({id: this.user.id, email: this.user.email, name: this.user.name});
    }
}

module.exports = GenerateToken;
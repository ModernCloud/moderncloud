const Joi = require('joi');
const firebaseAdmin = require('../../common/firebase');
const JWT = require('../jwt');
const ApiAction = require('../action');
const ApiError = require('../error');
const { User } = require('../../common/db');
const setupDefaultResources = require('./setup_default_resources');

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
        let decodedIdToken = await firebaseAdmin.auth().verifyIdToken(this.validRequest.id_token);
        this.googleUser = await firebaseAdmin.auth().getUser(decodedIdToken.uid);
    }

    async loadUser() {
        this.user = await User.query().where({'email': this.googleUser.email}).first();
        if (!(this.user instanceof User)) {
            await this.createUserIfNotExists();
        }
    }

    async createUserIfNotExists() {
        this.user = await User.query().insert({
            email: this.googleUser.email,
            password: '',
            name: this.googleUser.displayName
        });
        await setupDefaultResources(this.user);
    }

    async createToken() {
        this.token = JWT.generate({id: this.user.id, email: this.user.email, name: this.user.name});
    }
}

module.exports = GenerateToken;
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const JWT = require('../jwt');
const ApiAction = require('../action');
const ApiError = require('../error');
const { User, Project, Environment, Endpoint, Function } = require('../../common/db');

class SignupAction extends ApiAction
{
    async tryExecute() {
        await this.validateParams();
        await this.checkUserExists();
        await this.createUser();
        await this.createToken();
        await this.createDefaultProject();
        await this.createDefaultEnvironments();
        await this.createDefaultEndpoints();
        await this.createDefaultFunctions();
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
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            name: Joi.string().required()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async checkUserExists() {
        let user = await User.query().findOne({'email': this.validRequest.email});
        if (user instanceof User) {
            throw new ApiError('User already exists!', 10500, 400);
        }
    }

    async createUser() {
        this.user = await User.query().insert({
            email: this.validRequest.email,
            password: bcrypt.hashSync(this.validRequest.password, 10),
            name: this.validRequest.name
        });
    }

    async createToken() {
        this.token = JWT.generate({id: this.user.id, email: this.user.email, name: this.user.name});
    }

    async createDefaultProject() {
        this.project = await Project.query().insert({
            user_id: this.user.id,
            name: 'default'
        });
    }

    async createDefaultEnvironments() {
        await Environment.query().insert({
            user_id: this.user.id,
            project_id: this.project.id,
            name: 'dev',
            region: 'us-east-1'
        });
        await Environment.query().insert({
            user_id: this.user.id,
            project_id: this.project.id,
            name: 'prod',
            region: 'us-east-1'
        });
    }

    async createDefaultEndpoints() {
        await Endpoint.query().insert({
            user_id: this.user.id,
            project_id: this.project.id,
            name: 'endpoint_function_' + Date.now(),
            main_file: 'index.js',
            handler: 'index.handler',
            runtime: 'nodejs14.x',
            code: `exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({time: Date.now(), message: "my endpoint"}),
  }
}`,
            method: 'GET',
            path: '/hello-world'
        });
    }

    async createDefaultFunctions() {
        await Function.query().insert({
            user_id: this.user.id,
            project_id: this.project.id,
            name: 'my-function',
            main_file: 'index.js',
            handler: 'index.handler',
            runtime: 'nodejs14.x',
            code: `exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({time: Date.now(), message: "my function"}),
  }
}`,
        });
    }
}

module.exports = SignupAction;
const ApiResponse = require('./response');
const ApiError = require('./error');
const JWT = require('./jwt');
const {User} = require('../common/db');

class ApiAction {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.response = new ApiResponse(res);
        this.currentUser = null;
    }

    static async execute(req ,res) {
        let result = await (new this(req, res)).execute();
        let headers = Object.assign({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }, result.headers || {});
        res.set(headers);
        res.status(result.statusCode).send(result.body);
    }

    async execute() {
        try {
            return await this.tryExecute();
        } catch (e) {
            return await this.handleError(e);
        }
    }

    async tryExecute() {
        return this.response.success({});
    }

    async handleError(e) {
        return this.response.error(e);
    }

    async checkUser() {
        let jwtResult = await JWT.verify(this.req);
        let user = await User.query().findById(jwtResult.data.id);
        if (!user instanceof User) {
            throw new ApiError('Unauthorized', 10005, 401);
        }
        this.currentUser = user;
    }
}

module.exports = ApiAction;
const ApiError = require('./error');
const { ValidationError } = require('joi/lib/errors');

class ApiResponse {
    constructor(res) {
        this.res = res;
    }

    error(message, errorCode, statusCode) {
        let body = {error: {code: 10000, message: 'Internal Server Error'}};
        if (message instanceof ApiError) {
            console.error(message);
            body.error.code = message.customErrorCode;
            body.error.message = message.message;
            statusCode = message.httpStatusCode;
        } else if (message instanceof ValidationError) {
            console.warn(message);
            body.error.code = 10500;
            body.error.message = message.name;
            body.error.details = message.details;
            statusCode = 400;
        } else if (message instanceof Error) {
            console.error(message);
            statusCode = 500;
        }
        return {
            statusCode: statusCode,
            body: JSON.stringify(body),
        };
    }

    notFound(errorCode, message = 'Record Not Found') {
        return this.error(message, errorCode, 404)
    }

    badRequest(errorCode, message = 'Bad Request') {
        return this.error(message, errorCode, 400)
    }

    success(data, statusCode = 200) {
        return {
            statusCode: statusCode,
            body: JSON.stringify(data),
        };
    }
}

module.exports = ApiResponse;
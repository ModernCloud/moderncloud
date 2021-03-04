class ApiError extends Error {
    constructor(message = 'Internal Server Error', customErrorCode = 10000, httpStatusCode = 500) {
        super(message);
        this.customErrorCode = customErrorCode;
        this.httpStatusCode = httpStatusCode;
    }
}

module.exports = ApiError;
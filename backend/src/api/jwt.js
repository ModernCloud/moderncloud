const jsonwebtoken = require('jsonwebtoken');
const ApiError = require('./error');

exports.verify = async function (req) {
    return new Promise((resolve, reject) => {
        let authHeader = null;
        if (req.headers.hasOwnProperty('authorization')) {
            authHeader = req.headers.authorization;
        }
        if (authHeader == null) {
            return reject(new ApiError('Authorization header required!', 10004, 400));
        }
        const token = authHeader && authHeader.split(' ')[1];
        if (token === null) {
            return reject(new ApiError('Token is not valid!', 10003, 400));
        }
        jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                console.log(err);
                return reject(new ApiError('Unauthorized', 10005, 401));
            }
            return resolve(decodedToken);
        });
    });
};

exports.generate = function (data) {
    return jsonwebtoken.sign({data: data}, process.env.JWT_TOKEN_SECRET, {expiresIn: 60 * 60 * 24 * 7, algorithm: 'HS256'});
}
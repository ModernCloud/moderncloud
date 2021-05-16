const jsonwebtoken = require('jsonwebtoken');

exports.verify = async function (req) {
    return new Promise((resolve, reject) => {
        let authHeader = null;
        if (req.headers.hasOwnProperty('authorization')) {
            authHeader = req.headers.authorization;
        }
        if (authHeader == null) {
            return reject(new Error('Authorization header required!'));
        }
        const token = authHeader && authHeader.split(' ')[1];
        if (token === null) {
            return reject(new Error('Token is not valid!'));
        }
        jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                console.log(err);
                return reject(new Error('Unauthorized'));
            }
            return resolve(decodedToken);
        });
    });
};

exports.generate = function (data) {
    return jsonwebtoken.sign({data: data}, process.env.JWT_TOKEN_SECRET, {expiresIn: 60 * 60 * 24 * 7, algorithm: 'HS256'});
}
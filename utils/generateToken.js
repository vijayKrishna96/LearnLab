const jwt = require('jsonwebtoken')

const generateUserToken = (email, role , id) => {
    const token = jwt.sign({ email: email, role: role , userId: id }, process.env.JWT_SECRET);
    return token;
};

module.exports ={
    generateUserToken
}
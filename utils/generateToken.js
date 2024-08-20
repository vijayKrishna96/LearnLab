const jwt = require('jsonwebtoken')

const generateUserToken = (email, role) => {
    const token = jwt.sign({ email: email, role: role }, process.env.JWT_SECRET);
    return token;
};

module.exports ={
    generateUserToken
}
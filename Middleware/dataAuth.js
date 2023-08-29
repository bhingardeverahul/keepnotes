const JWT = require("jsonwebtoken");
const SECRET_KEY = "Rahul03";
// const users = require("../Models/userSchema");

const fetchall = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = JWT.verify(token, SECRET_KEY);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }


};
module.exports = fetchall;

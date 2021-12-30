const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        req.auth = {userId};
        if(req.body.userId/*celui déjà défini*/ && req.body.userId !== userId/*celui du token*/) {
            throw "User ID non valable !";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({error: error | "Requête non authentifiée !"});
    }
};
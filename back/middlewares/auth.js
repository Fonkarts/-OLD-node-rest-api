const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; 
        // Récupération du token dans le header "Authorization".
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        // Décodage des informations du token avec jsonwebtoken.
        const userId = decodedToken.userId; 
        // Définition de l'userId (du token).
        req.auth = {userId}; 
        // Définition d'un paramètre de requête valant l'userId.
        if(req.body.userId && req.body.userId !== userId) { 
            // Si l'userId de la requête ne correspond pas à l'userId du token...
            throw "User ID non valable !";
        } else { // Sinon, exécute le middleware suivant.
            next(); 
        }
    } catch (error) {
        res.status(401).json({error: error | "Requête non authentifiée !"});
    }
};
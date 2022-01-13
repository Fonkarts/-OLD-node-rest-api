const bcrypt = require("bcrypt");
// Pour le hachage du mot de passe + salage.

const jwt = require("jsonwebtoken");
// Pour l'attribution d'un token.

const User = require("../models/users");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    // Encrypte le password. 
    .then(hash => {
        const user = new User ({ // Création du nouvel utilisateur.
            email: req.body.email,
            password: hash
        });
        user.save() // Sauvegarde du profil utilisateur.
        .then(() => res.status(201).json({message: "Utilisateur créé !"}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};



exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) { // Si l'utilisateur n'existe pas...
            return res.status(404).json({message: "Utilisateur non trouvé !"});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) { // Si le hash du login ne correspond pas au (type de) hash 
                         // de l'utilisateur dans la base de donnée...
                return res.status(403).json({message: "Mot de passe incorrect !"});
            }
            res.status(200).json({ // Sinon...
                userId: user._id, // Attribution d'un userId.
                token: jwt.sign( // Attribution d'un token de session.
                    {userId: user._id},
                    "RANDOM_TOKEN_SECRET", // Clé générique provisoire, à remplacer pour la mise en service.
                    {expiresIn: "24h"} // Mesure de sécurité : expiration du token sous 24h si pas de connexion.
                )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};
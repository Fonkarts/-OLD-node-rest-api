const Sauce = require("../models/sauces");
const fs = require("fs"); // Importe "file system"
// const { parse } = require("path/posix");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, // = toutes les informations contenues dans le corps de la requête.
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save() // Sauvegarde dans la base de données
        .then(() => res.status(201).json({message: "Sauce créée !"}))
        .catch(error => res.status(400).json({error}));
};

exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const likedUserIndex = sauce.usersLiked.indexOf(req.body.userId);
            const dislikedUserIndex = sauce.usersDisliked.indexOf(req.body.userId);
            // Les index auxquels se trouvent les userId dans les tableaux "usersLiked" et "usersDisliked"
            // Si vaut "-1" l'utilisateur n'a pas encore liké/disliké la sauce en question.

            if(like==1 && likedUserIndex == -1) {
                // La seconde condition empêche l'envoi de plusieurs requêtes "like" via Postman.
                sauce.usersLiked.push(userId);
                sauce.likes+= 1;
            } 
            else if(like== -1 && dislikedUserIndex == -1) {
                // La seconde condition empêche l'envoi de plusieurs requêtes "dislike" via Postman.
                sauce.usersDisliked.push(userId);
                sauce.dislikes+= 1;
            } 
            else if(like== 0 && likedUserIndex !== -1) {
                // = Si l'utilisateur retire son vote et qu'il avait précédemment liké
                sauce.usersLiked.splice(likedUserIndex, 1);
                sauce.likes-=1; 
            } 
            else if(like== 0 && dislikedUserIndex !== -1) {
                // = Si l'utilisateur retire son vote et qu'il avait précédemment disliké
                sauce.usersDisliked.splice(dislikedUserIndex, 1);
                sauce.dislikes-=1;
            } 
            else {
                console.log("Modification des likes/dislikes refusée.");
            }
            sauce.save()
            .then(() => res.status(200).json({message: "Vote pris en compte !"}))
            .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.modifySauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if(!sauce) { // Si la sauce n'existe pas...
            return res.status(404).json({message: "Sauce non trouvée !"});
        }
        if(sauce.userId !== req.auth.userId) { // Si la requête n'est pas envoyée par la personne ayant créé la sauce...
            return res.status(403).json({message: "Requête non autorisée !"});
        } 
        const sauceObject = req.file ? // La requête contient-elle un fichier ?
        // Si oui:
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : /*Si non: */ {...req.body};
        Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message: "Sauce modifiée !"}))
            .catch(error => res.status(400).json({error}));
    })
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if(!sauce) { // Si la sauce n'existe pas...
                return res.status(404).json({message: "Sauce non trouvée !"});
            };
            if(sauce.userId !== req.auth.userId) { // Si la requête n'est pas envoyée par la personne ayant créé la sauce...
                return res.status(403).json({message: "Requête non autorisée !"});
            } 
            Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                const filename = sauce.imageUrl.split("/images/")[1];
                // Récupération du nom du fichier
                fs.unlink(`images/${filename}`, () => { // Supprime le fichier du stockage.
                    Sauce.deleteOne({ _id: req.params.id}) 
                    .then(() => res.status(200).json({message: "Sauce supprimée !"}))
                    .catch(error => res.status(400).json({error}));
                });
            })
        })
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};
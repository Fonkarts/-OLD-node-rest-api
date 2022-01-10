const Sauce = require("../models/sauces");
const fs = require("fs");
// const { parse } = require("path/posix");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
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
            if(like==1) {
                sauce.usersLiked.push(userId);
                sauce.likes+= 1;
            } 
            else if(like==-1) {
                sauce.usersDisliked.push(userId);
                sauce.dislikes+= 1;
            } 
            else if(like==0 && likedUserIndex !== -1) {
                sauce.usersLiked.splice(likedUserIndex, 1);
                sauce.likes-=1; 
            } 
            else if(like==0 && dislikedUserIndex !== -1) {
                sauce.usersDisliked.splice(dislikedUserIndex, 1);
                sauce.dislikes-=1;
            } 
            else {
            };
            sauce.save()
            .then(() => res.status(200).json({message: "ok !"}))
            .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: "Sauce modifiée !"}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if(!sauce) {
                return res.status(404).json({message: "Sauce non trouvée !"});
            };
            if(sauce.userId !== req.auth.userId) {
                return res.status(401).json({message: "Requête non autorisée !"});
            } 
        })
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id})
                .then(() => res.status(200).json({message: "Sauce supprimée !"}))
                .catch(error => res.status(400).json({error}));
            });
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
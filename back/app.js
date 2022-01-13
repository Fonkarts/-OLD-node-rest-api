const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Connexion à Mongoose
mongoose.connect("mongodb+srv://USERNAME:PASSWORD@cluster0.iuhb3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json()); 
// Demande à express d'intercepter toutes les requêtes contenant du JSON.

app.use((req, res, next) => { 
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:8081");
    // Autorise cette URL à envoyer des requêtes à l'app.
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    // Définit les headers à utiliser.
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    // Les types de requêtes acceptées.
    next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
// Indique à express de fonctionner de manière statique, avec le répertoire images, pour chaque requête adressée à /images.

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
// Définit les URI communes à chaque route pour éviter des répétitions dans les fichiers "routes" 

module.exports= app;
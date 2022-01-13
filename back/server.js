const http = require("http"); 
// importe package http

const app = require("./app");
// importe app.js 

const normalizePort = val => {
// Renvoie un port valide sous la forme d'une chaîne ou d'un numéro
    const port = parseInt(val, 10);

    if(isNaN(port)) {
        return val;
    }
    if(port>=0){
        return port;
    }
    return false;
};

const port = normalizePort(3000);
app.set("port", port);

const errorHandler = error => {
// Recherche les différentes erreurs et les gère de manière appropriée
// L'enregistre ensuite dans le server.
    if(error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    switch(error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app); // Déplacement de la fonction dans app.js

server.on("error", errorHandler);
server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    console.log("Listening on", + port);
});

server.listen(port); 



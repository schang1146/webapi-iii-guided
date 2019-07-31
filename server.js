// requirements
const express = require("express"); // importing a CommonJS module
const hubsRouter = require("./hubs/hubs-router.js");
const helmet = require("helmet");
const morgan = require("morgan");

const server = express();

// global 'use' pipeline
server.use(methodLogger);
server.use(express.json());
server.use("/api/hubs", hubsRouter);
server.use(helmet());
server.use(addName);
// server.use(lockout);
server.use(morgan("dev"));
server.use(gateKeeper);

server.get("/", (req, res) => {
    const nameInsert = req.name ? ` ${req.name}` : "";

    res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function methodLogger(req, res, next) {
    const nameInsert = req.name ? ` ${req.name}` : "";

    console.log(`${req.method} request received from ${nameInsert}`);
    next();
}

function addName(req, res, next) {
    console.log("adding name...");
    // req.name = req.headers;
    req.name = req.get("X-mycustomname");
    next();
}

function lockout(req, res, next) {
    res.status(403).json({ message: "API locked out!" });
}

function gateKeeper(req, res, next) {
    const sec = new Date().getSeconds();
    if (sec % 3 == 0) {
        res.status(403).json({ message: "I hate 3... try again..." });
    } else {
        next();
    }
}

module.exports = server;

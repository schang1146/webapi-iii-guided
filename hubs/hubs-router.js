const express = require("express");

const Hubs = require("./hubs-model.js");
const Messages = require("../messages/messages-model.js");

const router = express.Router();

router.use((req, res, next) => {
    console.log("hubs router baby!");
    next();
});

// this only runs if the url has /api/hubs in it
router.get("/", async (req, res) => {
    try {
        const hubs = await Hubs.find(req.query);
        res.status(200).json(hubs);
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: "Error retrieving the hubs"
        });
    }
});

// /api/hubs/:id

router.get("/:id", validateId, async (req, res) => {
    res.status(200).json(req.hub);
    // try {
    //     const hub = await Hubs.findById(req.params.id);

    //     if (hub) {
    //         res.status(200).json(hub);
    //     } else {
    //         res.status(404).json({ message: "Hub not found" });
    //     }
    // } catch (error) {
    //     // log error to server
    //     console.log(error);
    //     res.status(500).json({
    //         message: "Error retrieving the hub"
    //     });
    // }
});

router.post("/", validateBody, async (req, res) => {
    try {
        const hub = await Hubs.add(req.body);
        res.status(201).json(hub);
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: "Error adding the hub"
        });
    }
});

router.delete("/:id", validateId, async (req, res) => {
    try {
        const count = await Hubs.remove(req.params.id);
        if (count > 0) {
            res.status(200).json({ message: "The hub has been nuked" });
        } else {
            res.status(404).json({ message: "The hub could not be found" });
        }
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: "Error removing the hub"
        });
    }
});

router.put("/:id", validateId, validateBody, async (req, res) => {
    try {
        const hub = await Hubs.update(req.params.id, req.body);
        if (hub) {
            res.status(200).json(hub);
        } else {
            res.status(404).json({ message: "The hub could not be found" });
        }
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: "Error updating the hub"
        });
    }
});

// add an endpoint that returns all the messages for a hub
// this is a sub-route or sub-resource
router.get("/:id/messages", async (req, res) => {
    try {
        const messages = await Hubs.findHubMessages(req.params.id);

        res.status(200).json(messages);
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: "Error getting the messages for the hub"
        });
    }
});

// add an endpoint for adding new message to a hub
router.post("/:id/messages", validateBody, async (req, res) => {
    const messageInfo = { ...req.body, hub_id: req.params.id };

    try {
        const message = await Messages.add(messageInfo);
        res.status(210).json(message);
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: "Error getting the messages for the hub"
        });
    }
});

async function validateId(req, res, next) {
    console.log("checking for valid id...");
    try {
        const { id } = req.params;

        const hub = await Hubs.findById(id);

        if (hub) {
            req.hub = hub;
            next();
        } else {
            res.status(404).json({ message: "id not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

async function validateBody(req, res, next) {
    console.log("checking for body...");
    try {
        if (req.body) {
            next();
        } else {
            res.status(400).json({ message: "body not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = router;

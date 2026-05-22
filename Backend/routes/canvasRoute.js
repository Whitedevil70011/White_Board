const { getAllCanvases, createCanvas, loadCanvas,updateCanvas } = require("../controller/canvascontroller");

const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddlewares");

// Apply authentication middleware to all routes in this router
//router.use(authenticationMiddleware);

router.get("/", authenticationMiddleware, getAllCanvases);

router.post("/", authenticationMiddleware, createCanvas);
router.get("/load/:canvasId", authenticationMiddleware, loadCanvas);
roueter.put("/update/:canvasId", authenticationMiddleware, updateCanvas);
module.exports = router;
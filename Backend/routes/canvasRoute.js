const {
  getAllCanvases,
  createCanvas,
  loadCanvas,
  updateCanvas,
    shareCanvas,
} = require("../controller/canvascontroller");

const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddlewares");

// Apply authentication middleware to all routes in this router
//router.use(authenticationMiddleware);

router.get("/", authenticationMiddleware, getAllCanvases);

router.post("/", authenticationMiddleware, createCanvas);
router.get("/load/:canvasId", authenticationMiddleware, loadCanvas);
router.post("/share/:canvasId", authenticationMiddleware, shareCanvas);
router.put("/update/:canvasId", authenticationMiddleware, updateCanvas);
router.get("/:canvasId", authenticationMiddleware, loadCanvas);
router.put("/:canvasId", authenticationMiddleware, updateCanvas);

module.exports = router;

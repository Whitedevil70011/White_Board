const express = require("express");
const router = express.Router();
const { registerUser } = require("../controller/userController");

router.post("/", registerUser);

// export router
module.exports = router;
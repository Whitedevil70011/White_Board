const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../controller/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile);


// router.get('/', (req, res) => {
//   res.send('Hello  users');
// });
// router.post("/", (req, res) => {
//   res.send("Hello get a user post request");
// });

// export router
module.exports = router;
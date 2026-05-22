const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    console.log("we are in register route");
  res.send("we are in register route");
});
router.post("/post", (req, res) => {
  res.send("Hello get a user post request");
});

// export router
module.exports = router;
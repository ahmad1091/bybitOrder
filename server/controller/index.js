const router = require("express").Router();
const limitOrder = require("./limitOrder");

router.post("/applyLimitOrder", limitOrder.post);

module.exports = router;

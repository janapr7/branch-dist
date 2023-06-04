const router = require("express").Router();
const {branchController} = require("../controllers")

router.get("/", branchController.getBranch);

module.exports = router;

const taskController = require("../../controllers/TaskElastic");

const router = require("express").Router();


router.post("/createIndex", taskController.createIndex);
router.get("/", taskController.getIndex);


module.exports = router;
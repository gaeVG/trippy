const express = require("express")
const router = express.Router()

const hostelsController = require("../controllers/hostelController")


router.use(express.json())

router.get("/", hostelsController.getAllHostels)

router.post("/",
	hostelsController.checkHostel(),
	hostelsController.validateHostel,
	hostelsController.createHostel
);

router.get("/:id", hostelsController.getHostelbyID);
router.patch("/:id", hostelsController.updateHostel);
router.delete("/:id", hostelsController.deleteHostel);

module.exports = router;
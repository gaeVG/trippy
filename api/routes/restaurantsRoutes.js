const express = require("express")
const router = express.Router()

const restaurantsController = require("../controllers/restaurantController")


router.use(express.json())

router.get("/", restaurantsController.getAllRestaurants)
router.post("/",
    restaurantsController.checkRestaurant(),
    restaurantsController.validateRestaurant,
    restaurantsController.createRestaurant
);
router.get("/:id", restaurantsController.getRestaurantbyID);
router.put("/:id", restaurantsController.updateRestaurant);
router.delete("/:id", restaurantsController.deleteRestaurant);

module.exports = router;
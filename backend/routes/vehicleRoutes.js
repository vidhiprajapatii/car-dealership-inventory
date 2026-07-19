const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const {
    createVehicle,
    viewVehicles,
    editVehicle,
    removeVehicle,
    searchVehicle,
    buyVehicle,
    refillVehicle
} = require("../controllers/vehicleController");

// Add Vehicle
router.post("/", authenticate, createVehicle);

// Get All Vehicles
router.get("/", authenticate, viewVehicles);

router.get("/search", authenticate, searchVehicle);

// Update Vehicle
router.put("/:id", authenticate, editVehicle);


router.post("/:id/purchase", authenticate, buyVehicle);

router.post("/:id/restock", authenticate, refillVehicle);

// Delete Vehicle
router.delete("/:id", authenticate, removeVehicle);

module.exports = router;
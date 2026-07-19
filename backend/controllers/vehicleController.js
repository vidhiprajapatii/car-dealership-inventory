const {
    addVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    searchVehicles,
    purchaseVehicle,
    restockVehicle
} = require("../models/vehicleModel");



// Add Vehicle
async function createVehicle(req, res) {
    try {

        const {
            make,
            model,
            category,
            price,
            quantity
        } = req.body;

        const id = await addVehicle(
            make,
            model,
            category,
            price,
            quantity
        );

        res.status(201).json({
            message: "Vehicle Added",
            vehicleId: id
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }
}

// Get All Vehicles
async function viewVehicles(req, res) {

    const vehicles = await getVehicles();

    res.json(vehicles);

}

// Update Vehicle
async function editVehicle(req, res) {

    try {

        const id = req.params.id;

        const vehicle = await getVehicleById(id);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle Not Found"
            });
        }

        const {
            make,
            model,
            category,
            price,
            quantity
        } = req.body;

        await updateVehicle(
            id,
            make,
            model,
            category,
            price,
            quantity
        );

        res.json({
            message: "Vehicle Updated Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: "Server Error"
        });

    }

}

// Delete Vehicle
async function removeVehicle(req, res) {

    try {

        const id = req.params.id;

        const vehicle = await getVehicleById(id);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle Not Found"
            });
        }

        await deleteVehicle(id);

        res.json({
            message: "Vehicle Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: "Server Error"
        });

    }

}

async function buyVehicle(req, res) {

    try {

        const { id } = req.params;
        const { quantity } = req.body;

        const result = await purchaseVehicle(id, quantity);

        if (result.error) {
            return res.status(400).json({
                message: result.error
            });
        }

        res.json({
            message: "Vehicle Purchased Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

}

async function refillVehicle(req, res) {

    try {

        const { id } = req.params;
        const { quantity } = req.body;

        const result = await restockVehicle(id, quantity);

        if (result.error) {
            return res.status(400).json({
                message: result.error
            });
        }

        res.json({
            message: "Vehicle Restocked Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

}

async function searchVehicle(req, res) {

    try {

        const { search } = req.query;

        const vehicles = await searchVehicles(search || "");

        res.json(vehicles);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

}

module.exports = {
    createVehicle,
    viewVehicles,
    editVehicle,
    removeVehicle,
    searchVehicle,
    buyVehicle,
    refillVehicle
};
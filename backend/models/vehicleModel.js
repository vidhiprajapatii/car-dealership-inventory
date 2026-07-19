const { getDB } = require("../database/db");

async function addVehicle(make, model, category, price, quantity) {
    const db = getDB();

    const result = await db.run(
        `INSERT INTO vehicles (make, model, category, price, quantity)
        VALUES (?, ?, ?, ?, ?)`,
        [make, model, category, price, quantity]
    );

    return result.lastID;
}

async function getVehicles() {
    const db = getDB();
    return await db.all("SELECT * FROM vehicles");
}

async function getVehicleById(id) {
    const db = getDB();
    return await db.get("SELECT * FROM vehicles WHERE id=?", [id]);
}

async function updateVehicle(id, make, model, category, price, quantity) {
    const db = getDB();

    await db.run(
        `UPDATE vehicles
         SET make=?, model=?, category=?, price=?, quantity=?
         WHERE id=?`,
        [make, model, category, price, quantity, id]
    );
}

async function deleteVehicle(id) {
    const db = getDB();

    await db.run(
        "DELETE FROM vehicles WHERE id=?",
        [id]
    );
}

async function searchVehicles(search) {
    const db = getDB();

    return await db.all(
        `SELECT * FROM vehicles
         WHERE make LIKE ?
         OR model LIKE ?
         OR category LIKE ?`,
        [`%${search}%`, `%${search}%`, `%${search}%`]
    );
}

async function purchaseVehicle(id, quantity) {
    const db = getDB();

    const vehicle = await db.get(
        "SELECT * FROM vehicles WHERE id=?",
        [id]
    );

    if (!vehicle) {
        return { error: "Vehicle Not Found" };
    }

    if (vehicle.quantity < quantity) {
        return { error: "Insufficient Stock" };
    }

    await db.run(
        "UPDATE vehicles SET quantity=? WHERE id=?",
        [vehicle.quantity - quantity, id]
    );

    return { success: true };
}

async function restockVehicle(id, quantity) {
    const db = getDB();

    const vehicle = await db.get(
        "SELECT * FROM vehicles WHERE id=?",
        [id]
    );

    if (!vehicle) {
        return { error: "Vehicle Not Found" };
    }

    await db.run(
        "UPDATE vehicles SET quantity=? WHERE id=?",
        [vehicle.quantity + quantity, id]
    );

    return { success: true };
}

module.exports = {
    addVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    searchVehicles,
    purchaseVehicle,
    restockVehicle
};
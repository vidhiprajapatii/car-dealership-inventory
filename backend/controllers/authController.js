const bcrypt = require("bcryptjs");
const { createUser, findUserByEmail } = require("../models/userModel");

async function register(req, res) {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const id = await createUser(
            name,
            email,
            hashedPassword
        );

        res.status(201).json({
            message: "User Registered Successfully",
            userId: id
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

}

const jwt = require("jsonwebtoken");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            "secretkey",
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login Successful",
            token
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    register,
    login
};


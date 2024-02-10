// Importing important libraries
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

// Model
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Set up static file path
app.use(express.static('public'));

// Render login page at root
app.get("/", (req, res) => {
    res.render("login");
});

// Render login page
app.get("/login", (req, res) => {
    res.render("login");
});

// Render signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register user
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    try {
        // Check if user already exists
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            return res.status(400).send("User Already Exists. Try Different Username");
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        // Save user data to the database
        const userData = await collection.create(data);
        console.log(userData);
        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user");
    }
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("Username not found");
        }
        // Compare the hashed password from the database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("Home");
        } else {
            res.send("Wrong Password");
        }
    } catch (error) {
        console.error(error);
        res.send("Wrong Details");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

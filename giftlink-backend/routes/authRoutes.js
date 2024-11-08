//Step 1 - Task 2: Import necessary packages
const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger
//Step 1 - Task 3: Create a Pino logger instance
const logger = pino();  // Create a Pino logger instance
dotenv.config();

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;
router.post('/register', async (req, res) => {
//Step 2
});
router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        // {{insert code here}}
        const db = await connectToDatabase();
        // Task 2: Access MongoDB collection
        // {{insert code here}}
        const collection = db.collection("users");
        //Task 3: Check for existing email
        // {{insert code here}}
        const existingEmail = await collection.findOne({ email: req.body.email });
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        // {{insert code here}} //Task 4: Save user details in database
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

         // {{insert code here}} //Task 5: Create JWT authentication with user._id as payload
        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({authtoken,email});
    } catch (e) {
         return res.status(500).send('Internal server error');
    }
});

module.exports = router;
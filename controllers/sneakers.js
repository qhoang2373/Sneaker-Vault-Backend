const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Sneaker = require('../models/sneaker.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const sneaker = await Sneaker.create(req.body);
        sneaker._doc.author = req.user;
        res.status(200).json(sneaker);

    }catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


module.exports = router;

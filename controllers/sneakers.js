const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Sneaker = require('../models/sneaker.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

// Create Route 
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

// index route
router.get('/', async (req, res) => {
    try {
      const sneakers = await Sneaker.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
      res.status(200).json(sneakers);
    } catch (error) {
      res.status(500).json(error);
    }
  });




module.exports = router;

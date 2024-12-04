const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Sneaker = require('../models/sneaker.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

// Create Route: COMPLETE
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

// index route: COMPLETE
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

  // Show Route: COMPLETE
  router.get('/:sneakerId', async (req, res) => {
    try {
      const sneaker = await Sneaker.findById(req.params.sneakerId).populate('author');
      res.status(200).json(sneaker);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  // Update route: COMPLETE
  router.put('/:sneakerId', async (req, res) => {
    try {
      const sneaker = await Sneaker.findById(req.params.sneakerId);
        if (!sneaker.author.equals(req.user._id)) {
        return res.status(403).send("Access Denied!");
      }
        const updatedSneaker = await Sneaker.findByIdAndUpdate(
          req.params.sneakerId,
          req.body, 
          { new: true }
        );
        updatedSneaker._doc.author = req.user;
        res.status(200).json(updatedSneaker);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  // Delete route: COMPLETE
  router.delete('/:sneakerId', async (req,res) => {
    try{
        const sneaker = await Sneaker.findById(req.params.sneakerId);

        if(!sneaker.author.equals(req.user._id)) {
            return res.status(403).send("Access Denied!")
        }

    const deletedSneaker = await Sneaker.findByIdAndDelete(req.params.sneakerId);
    res.status(200).json(deletedSneaker);

    }catch(error) {
        res.status(500).json(error)
    }
});

// Create Comment route:
router.post('/:sneakerId/comments', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const sneaker = await Sneaker.findById(req.params.sneakerId);
    sneaker.comments.push(req.body);
    await sneaker.save();
    console.log(sneaker, {body:req.body})
    const newComment = sneaker.comments[sneaker.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});


  
module.exports = router;


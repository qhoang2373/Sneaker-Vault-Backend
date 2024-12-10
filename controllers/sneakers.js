const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Sneaker = require('../models/sneaker.js');
const router = express.Router();

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

  router.get('/:sneakerId', async (req, res) => {
    try {
      const sneaker = await Sneaker.findById(req.params.sneakerId).populate(['author','comments.author',
      ]);
      res.status(200).json(sneaker);
    } catch (error) {
      res.status(500).json(error);
    }
  });

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

router.post('/:sneakerId/comments', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const sneaker = await Sneaker.findById(req.params.sneakerId);
    sneaker.comments.push(req.body);
    await sneaker.save();
    const newComment = sneaker.comments[sneaker.comments.length - 1];
    newComment._doc.author = req.user
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:sneakerId/comments/:commentId', async (req, res) => {
  try {
    const sneaker = await Sneaker.findById(req.params.sneakerId);
    const comment = sneaker.comments.id(req.params.commentId);
    await sneaker.save();
    res.status(200).json({ message: 'Ok' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:sneakerId/comments/:commentId', async (req, res) => {
  try {
    const sneaker = await Sneaker.findById(req.params.sneakerId);
    sneaker.comments.remove({ _id: req.params.commentId });
    await sneaker.save();
    res.status(200).json({ message: 'Ok' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;


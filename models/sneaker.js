const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const sneakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
      enum: ['Nike', 'Adidas', 'Jordan', 'NewBalance']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
    comments: [commentSchema]
  }, 
  { timestamps: true }
);

const Sneaker = mongoose.model('Sneaker', sneakerSchema);

module.exports = Sneaker

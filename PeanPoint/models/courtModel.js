const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true }
});

const courtSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  picturesUrls: [{ type: String }],
  reviews: [reviewSchema]
});

courtSchema.index({ location: '2dsphere' });

courtSchema.pre('save', function(next) {
  console.log(`Saving court with ID: ${this._id}`);
  next();
});

courtSchema.post('save', function(doc) {
  console.log(`Court with ID: ${doc._id} saved successfully`);
});

courtSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error(`Error saving court with ID: ${doc._id}`, error.message, error.stack);
    next(error);
  } else {
    next();
  }
});

module.exports = mongoose.model('Court', courtSchema);
const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  caption: { type: String, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

reelSchema.pre('save', function(next) {
  console.log(`Saving reel with ID: ${this._id}`);
  next();
});

reelSchema.post('save', function(doc, next) {
  console.log(`Reel with ID: ${doc._id} saved successfully`);
  next();
});

reelSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error(`Error saving reel with ID: ${doc._id}`, error.message, error.stack);
    next(error);
  } else {
    next();
  }
});

module.exports = mongoose.model('Reel', reelSchema);
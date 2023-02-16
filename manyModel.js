const mongoose = require("mongoose");

const Tag = mongoose.model(
  "Tag",
  new mongoose.Schema({
    name: String,
    slug: String,
    tutorials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutorial"
      }
    ]
  })
);

module.exports = Tag;


const Tutorial = mongoose.model(
  "Tutorial",
  new mongoose.Schema({
    title: String,
    author: String,
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
      }
    ]
  })
);


TutorialSchema.pre('save', function(next){

  // remove tutorials from tags
  this.model('Tag').updateMany({ _id: { $nin: this.tags } }, { $pull: { tutorials: this._id} } ).exec()

  // add tutorials to tags:
  this.model('Tag').updateMany({ _id: { $in: this.tags } }, { $addToSet: { tutorials: this._id } } ).exec()

  next();
})


TagSchema.pre('save', function(next){

  // remove tags from tutorial:
  this.model('Tutorial').updateMany({ _id: { $nin: this.tutorials } }, { $pull: { tags: this._id} } ).exec()
  
  // add tags to tutorial:
  this.model('Tutorial').updateMany({ _id: { $in: this.tutorials } }, { $addToSet: { tags: this._id } } ).exec()

  next();
});

module.exports = Tutorial;
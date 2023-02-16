const mongoose = require("mongoose");
const db = require("./models");

const createTutorial = function(tutorial) {
  return db.Tutorial.create(tutorial).then(docTutorial => {
    console.log("\n>> Created Tutorial:\n", docTutorial);
    return docTutorial;
  });
};

const createTag = function(tag) {
  return db.Tag.create(tag).then(docTag => {
    console.log("\n>> Created Tag:\n", docTag);
    return docTag;
  });
};

const addTagToTutorial = function(tutorialId, tag) {
    return db.Tutorial.findByIdAndUpdate(
      tutorialId,
      { $push: { tags: tag._id } },
      { new: true, useFindAndModify: false }
    );
  };
  
const addTutorialToTag = function(tagId, tutorial) { 
    return db.Tag.findByIdAndUpdate(
        tagId,
        { $push: { tutorials: tutorial._id } },
        { new: true, useFindAndModify: false }
    );
};

const getTutorialWithPopulate = function(id) {
    return db.Tutorial.findById(id).populate("tags");
};

const getTagWithPopulate = function(id) {
    return db.Tag.findById(id).populate("tutorials");
};

const run = async function() {
    // ...

    // add this
    tutorial = await getTutorialWithPopulate(tut1._id);
    console.log("\n>> populated tut1:\n", tutorial);

    tag = await getTagWithPopulate(tag._id);
    console.log("\n>> populated tagB:\n", tag);
};

const getTutorialWithPopulate = function(id) {
    return db.Tutorial.findById(id).populate("tags", "-_id -__v -tutorials");
  };
  
  const getTagWithPopulate = function(id) {
    return db.Tag.findById(id).populate("tutorials", "-_id -__v -tags");
};
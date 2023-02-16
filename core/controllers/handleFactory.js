const tryCatch = require('./../helpers/tryCatch');
const ErrorBoundary = require('./../helpers/ErrorBoundary');
const APIFeatures = require('./../helpers/APIFeatures');
const slugify = require('slugify');


exports.createOne = Model =>
  tryCatch(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
});


exports.getAll = (Model, selected = null) =>
  tryCatch(async (req, res, next) => {

    let filter = {};

    if(req.params.categoryId) filter = {"ancestors._id": req.params.categoryId};
    if(req.params.classRoomId) filter = {"ancestors._id": req.params.classRoomId};

    const features = new APIFeatures(Model.find(filter), req.query);
      features.filter();
      features.sort();
      features.limitFields();
      features.paginate();
    // const doc2 = await features.query.explain();


    const doc = await features.query.select(selected);


    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
});

exports.getOne = (Model, popOptions) =>
  tryCatch(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;


    if (!doc) {
      return next(new ErrorBoundary('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
});


exports.deleteOne = Model =>
  tryCatch(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new ErrorBoundary('No document found with that ID', 404));
    }


    res.status(204).json({
      status: 'success',
      data: null
    });
});

exports.updateOne = (Model) =>
  tryCatch(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!doc) {
      return next(new ErrorBoundary('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
});






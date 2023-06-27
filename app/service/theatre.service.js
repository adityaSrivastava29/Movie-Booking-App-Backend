const { theatreDetails } = require("../models/theatre.model");

exports.addNewTheatre = async (theatre) => {
  const save = await new theatreDetails({
    theatreName: theatre.theatreName,
    city: theatre.city,
    cost: theatre.cost,
  }).save();
  return save;
};

exports.getAllTheatres = async () => {
  return await theatreDetails.find();
};

exports.getTheatreById = async (id) => {
  return await theatreDetails.findById(id);
};

exports.getTheatreByName = async (name) => {
  return await theatreDetails.find({ theatreName: name });
};

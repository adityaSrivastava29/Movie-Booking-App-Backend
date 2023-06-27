const mongooseUniqueValidator = require("mongoose-unique-validator");
const { mongo } = require("../../Configure/database.config");
const Joi = require("joi");

const actorsSchema = new mongo.Schema({
  actorName: {
    type: String,
    required: [true, "Actor Name is required"],
    unique: [true, "Actor already exists"],
    sparse: true,
  },
  actorPhotoLink: {
    type: String,
    default:
      "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
  },
});

const showDetailsSchema = new mongo.Schema({
  showTime: {
    type: String,
    validate: {
      validator: (time) => {
        return /([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(time);
      },
      message: "Please enter time in 24 hours format",
    },
    required: [true, "Show Times are required"],
  },
  seats: {
    type: Number,
    required: [true, "Seat for the show and for every theatre is required"],
  },
  bookings: {
    type: [mongo.Schema.Types.ObjectId],
    ref: "Bookings",
    default: [],
  },
});

const showSchema = new mongo.Schema({
  theatreId: {
    type: mongo.Schema.Types.ObjectId,
    required: [true, "Theatre is required"],
    sparse: true,
    ref: "Theatres",
  },
  showDetails: {
    type: [showDetailsSchema],
    required: [true, "Show Details is required"],
  },
});

const movieSchema = new mongo.Schema({
  movieName: {
    type: String,
    min: [3, "Minimum 3 characters are required"],
    unique: [true, "Movie Name should be unique"],
    required: [true, "Movie Name is required"],
  },
  starring: {
    type: [mongo.Schema.Types.ObjectId],
    ref: "Actors Details",
  },
  shows: {
    type: [showSchema],
    required: [true, "Shows are required"],
  },
  moviePosterLink: {
    type: String,
    required: [true, "Please provide movie poster link"],
  },
  releaseDate: {
    type: Date,
    default: Date.now(),
  },
});
movieSchema.plugin(mongooseUniqueValidator);
actorsSchema.plugin(mongooseUniqueValidator);

exports.actors = mongo.model("Actors Details", actorsSchema);
exports.movieDetails = mongo.model("Movie Details", movieSchema);

exports.validateUpdateSeats = Joi.object({
  type: Joi.string().valid("DELETE", "ADD").required(),
  theatreId: Joi.string().required(),
  showTime: Joi.string()
    .pattern(new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]"))
    .required(),
  numberOfSeats: Joi.number().required(),
});

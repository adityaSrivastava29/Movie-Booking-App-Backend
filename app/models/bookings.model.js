const Joi = require("joi");
const { mongo } = require("../../Configure/database.config");

const bookingSchema = new mongo.Schema({
  userId: {
    type: mongo.Schema.Types.ObjectId,
    ref: "UserData",
    required: [true, "User Id is required"],
  },
  movieName: {
    type: String,
    required: [true, "Movie Details are required"],
  },
  theatreId: {
    type: mongo.Schema.Types.ObjectId,
    ref: "Theatres",
    required: [true, "Theatre name is required"],
  },
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
  numberOfTickets: {
    type: Number,
    required: [true, "numberOfTickets are required"],
  },
  seatNumbers: {
    type: [String],
    required: [true, "Seat Numbers are required"],
  },
  totalCost: {
    type: Number,
    required: [true, "Total Cost is required"],
  },
});

exports.bookingModel = mongo.model("Bookings", bookingSchema);
exports.validateBookingData = Joi.object({
  theatreId: Joi.string().required(),
  numberOfTickets: Joi.number().required(),
  showTime: Joi.string()
    .pattern(new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]"))
    .required(),
  seatNumbers: Joi.array().length(Joi.ref("numberOfTickets")).required(),
});

const { mongo } = require("../../Configure/database.config");

const theatreSchema = new mongo.Schema({
  theatreName: {
    type: String,
    sparse: true,
    required: [true, "Theatre Name is required"],
  },
  city: {
    type: String,
    required: [true, "The city of theatre is required"],
  },
  cost: {
    type: Number,
    required: [true, "Cost of per seat is required"],
  },
});

exports.theatreDetails = mongo.model("Theatres", theatreSchema);

const asyncHandler = require("../middleware/asyncHandler.middleware");
const { validateBookingData } = require("../models/bookings.model");
const { validateUpdateSeats } = require("../models/movies.model");
const {
  getAllMovies,
  searchMovieByName,
  addNewMovie,
  addNewActor,
  getAllActors,
  bookTicket,
  deleteMovie,
  removeTheatreSeats,
  addTheatreSeats,
  getMyBookings,
  getActorById,
  getAllBookings,
  getBookedSeats,
  deleteBooking,
} = require("../service/movies.service");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getAllMovies = asyncHandler(async (req, res) => {
  await getAllMovies().then((result) => res.json({ payload: result }));
});

exports.findByName = asyncHandler(async (req, res) => {
  await searchMovieByName(req.params.movieName).then((result) =>
    res.json({ payload: result })
  );
});

exports.addNewMovie = asyncHandler(async (req, res) => {
  await addNewMovie(req.body).then((result) =>
    res.status(201).json({ payload: result , message: "Movie added successfully"})
  );
});

exports.addNewActor = asyncHandler(async (req, res) => {
  await addNewActor(req.body).then((result) =>
    res.status(201).json({ payload: result })
  );
});

exports.getAllActors = asyncHandler(async (req, res) => {
  await getAllActors().then((result) => res.json({ payload: result }));
});

exports.bookTicket = asyncHandler(async (req, res, next) => {
  const { error } = validateBookingData.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.message, 400));
  }
  await bookTicket(
    req.params.movieName,
    req.body,
    req.header("Authorization")
  ).then((result) => {
    res.status(201).json({ payload: result });
  });
});

exports.deleteMovie = asyncHandler(async (req, res) => {
  await deleteMovie(req.params.movieName).then((result) =>
    res.status(202).json({
      payload: result,
    })
  );
});

exports.updateTickets = asyncHandler(async (req, res, next) => {
  const { error } = validateUpdateSeats.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.message, 400));
  }

  const theatreId = req.body.theatreId;
  const movieName = req.params.movieName;
  const showTime = req.body.showTime;
  const numberOfSeats = req.body.numberOfSeats;
  if (req.body.type === "DELETE") {
    await removeTheatreSeats(
      theatreId,
      movieName,
      showTime,
      numberOfSeats
    ).then((result) => res.status(202).json({ payload: result }));
  } else {
    await addTheatreSeats(theatreId, movieName, showTime, numberOfSeats).then(
      (result) => res.status(202).json({ payload: result })
    );
  }
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const auth = req.header("Authorization");
  await getMyBookings(auth).then((result) => res.json({ payload: result }));
});

exports.getActorById = asyncHandler(async (req, res) => {
  await getActorById(req.params.actorId).then((result) =>
    res.json({ payload: result })
  );
});

exports.getAllBookings = asyncHandler(async (req, res) => {
  await getAllBookings().then((result) => res.json({ payload: result }));
});

exports.getBookedSeats = asyncHandler(async (req, res) => {
  await getBookedSeats(
    req.params.movieName,
    req.params.theatreId,
    req.params.showTime
  ).then((result) => res.json({ payload: result }));
});

exports.deleteBooking = asyncHandler(async (req, res) => {
   await deleteBooking(req.params.bookingId).then((result) => res.json({ payload: result }));
});

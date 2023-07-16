const { movieDetails, actors } = require("../models/movies.model");
const ErrorResponse = require("../utils/ErrorResponse");
const { validateToken } = require("./auth.service");
const { bookingModel } = require("../models/bookings.model");
const { getTheatreById, getTheatreByName } = require("./theatre.service");

exports.getAllMovies = async () => {
  return await movieDetails.find();
};

exports.searchMovieByName = async (searchFor) => {
  const movie = await movieDetails.findOne({ movieName: searchFor });
  if (movie === null) {
    throw new ErrorResponse("Invalid Movie name", 404);
  }
  const theatre = await getTheatreById(movie.shows[0].theatreId);

  const Actors = [];
  for (let i = 0; i < movie?.starring?.length; i++) {
    const actor = await actors.findById(movie.starring[i]);
    Actors.push(actor);
  }
  return {
    movie: movie,
    theatre: theatre,
    actors: Actors,
  };
};

exports.addNewMovie = async (movie) => {
  const releaseDate = new Date(movie.releaseDate);
  await getTheatreByName;
  const save = await new movieDetails({
    movieName: movie.movieName,
    starring: movie.starring,
    shows: movie.shows,
    moviePosterLink: movie.moviePosterLink,
    releaseDate: releaseDate,
  }).save();
  return {
    id: save._id,
    name: save.movieName,
    message: "Movie added successfully",
  };
};

exports.addNewActor = async (data) => {
  return await new actors({
    actorName: data.actorName,
    actorPhotoLink: data.actorPhotoLink,
  }).save();
};

exports.getAllActors = async () => {
  return await actors.find();
};

exports.bookTicket = async (movieName, bookingData, token) => {
  const userId = validateToken(token.slice(7));
  const movieModel = await getMovieDetails(movieName, bookingData.theatreId);
  console.log("movieModel--------" + JSON.stringify(movieModel));
  const theatreDetails = getTheatreDetails(
    movieModel,
    bookingData.theatreId,
    bookingData.showTime
  );
  console.log("bookingData--------" + JSON.stringify(bookingData));
  console.log("theatreDetails--------" + JSON.stringify(theatreDetails));
  const afterBooking =
    bookingData.numberOfTickets + theatreDetails.shows.bookings.length;
    console.log("afterBooking--------" + afterBooking);
    console.log("theatreDetails.shows.bookings.length--------" + theatreDetails.shows.bookings.length);
    console.log("theatreDetails.shows.seats--------" + theatreDetails.shows.seats);
  // if (afterBooking > theatreDetails.shows.seats) {
  //   throw new ErrorResponse("No Seats Available", 400);
  // }

  const totalCost =
    (await getTheatreById(bookingData.theatreId)).cost *
    bookingData.numberOfTickets;

  const booking = new bookingModel({
    userId: userId,
    movieName: movieName,
    theatreId: bookingData.theatreId,
    showTime: bookingData.showTime,
    numberOfTickets: bookingData.numberOfTickets,
    seatNumbers: bookingData.seatNumbers,
    totalCost: totalCost,
    dateOfBooking: bookingData.dateOfBooking,
  });
  const save = await booking.save();
  theatreDetails.theatre.showDetails.forEach((show) => {
    if (bookingData.showTime === show.showTime) show.bookings.push(save._id);
  });
  movieModel.shows.forEach((show) => {
    if (show.theatreId.toString() === bookingData.theatreId) {
      movieModel.showsDetails = theatreDetails;
    }
  });
  await movieModel.save();
  return {
    message: "Booking Confirmed",
    bookingDetails: save,
  };
};

exports.deleteBooking = async (bookingId) => {
  const booking = await bookingModel.findById(bookingId);
  if (booking === null) {
    throw new ErrorResponse("Invalid Booking Id", 404);
  }
  await bookingModel.findByIdAndDelete(bookingId);
  return {
         bookingId: bookingId,
         message: `${bookingId} is deleted successfully`
        };
};


exports.addTheatreSeats = async (
  theatreId,
  movieName,
  showTime,
  numberOfSeats
) => {
  const movieModel = await getMovieDetails(movieName, theatreId);
  const theatreDetails = getTheatreDetails(movieModel, theatreId, showTime);

  theatreDetails.theatre.showDetails.forEach((show) => {
    if (showTime === show.showTime)
      show.seats = Number(show.seats) + Number(numberOfSeats);
  });

  movieModel.shows.forEach((show) => {
    if (show.theatreId.toString() === theatreId) {
      movieModel.showsDetails = theatreDetails;
    }
  });
  return await movieModel.save();
};

exports.removeTheatreSeats = async (
  theatreId,
  movieName,
  showTime,
  numberOfSeats
) => {
  const movieModel = await getMovieDetails(movieName, theatreId);
  const theatreDetails = getTheatreDetails(movieModel, theatreId, showTime);

  theatreDetails.theatre.showDetails.forEach((show) => {
    if (showTime === show.showTime) {
      const afterRemoving = Number(show.seats) - Number(numberOfSeats);
      if (afterRemoving <= 0) {
        const index = theatreDetails.theatre.showDetails.indexOf(show);
        theatreDetails.theatre.showDetails.splice(index, 1);
      } else {
        show.seats -= numberOfSeats;
      }
    }
  });

  movieModel.shows.forEach((show) => {
    if (show.theatreId.toString() === theatreId) {
      movieModel.showsDetails = theatreDetails;
    }
  });
  return await movieModel.save();
};

exports.deleteMovie = async (movieName) => {
  const deleted = await movieDetails.findOneAndDelete({ movieName: movieName });
  return `${deleted._id} is deleted successfully`;
};

exports.getMyBookings = async (token) => {
  const userId = validateToken(token.slice(7));
  const bookings = await bookingModel.find({ userId: userId });
  const result = [];
  const mybooking = {
    booking: {},
    theatreName: {},
  };

  for (let i = 0; i < bookings.length; i++) {
    const theatre = await getTheatreById(bookings[i].theatreId);
    result.push({ booking: bookings[i],
    theatreName: theatre.theatreName});
   
  }
  return result;
};

exports.getActorById = async (actorId) => {
  return await actors.findById(actorId);
};

exports.getAllBookings = async () => {
  return await bookingModel.find();
};

exports.getBookedSeats = async (movieName, theatreId, showTime) => {
  return await bookingModel
    .find({ movieName: movieName, theatreId: theatreId, showTime: showTime })
    .select("seatNumbers");
};

async function getMovieDetails(movieName, theatreId) {
  const movieModel = await movieDetails.findOne({
    $and: [{ movieName: movieName }, { "shows.theatreId": theatreId }],
  });
  if (movieModel === null) {
    throw new ErrorResponse("No theatre found", 404);
  }
  return movieModel;
}

function getTheatreDetails(movieModel, theatreId, showTime) {
 
  const theatreDetails = movieModel.shows.find(
    (show) => show.theatreId.toString() === theatreId
  );
  const showTimeDetails = theatreDetails?.showDetails.find(
    (theatre) => showTime === theatre.showTime
  );
  console.log("showTimeDetails--------" + JSON.stringify(showTimeDetails));
  if (showTimeDetails === undefined) {
    throw new ErrorResponse("Invalid Show Timing", 400);
  }
  return {
    theatre: theatreDetails,
    shows: showTimeDetails,
  };
}

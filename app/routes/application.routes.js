const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  giveAdminAccess,
  validateToken,
  getUserById,
  getAllUsers,
  aboutMe,
  logoutUser,
} = require("../controllers/auth.controller");
const {
  getAllMovies,
  findByName,
  addNewMovie,
  addNewActor,
  getAllActors,
  bookTicket,
  deleteMovie,
  updateTickets,
  getMyBookings,
  getActorById,
  getAllBookings,
  getBookedSeats,
} = require("../controllers/movies.controller");
const {
  addNewTheatre,
  getAllTheatre,
  getTheatreById,
} = require("../controllers/theatre.controller");
const {
  authenticateAdmin,
  authenticate,
} = require("../middleware/authentication.middleware");
const router = require("express").Router();

// Login, Signup and Forgot Password Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/validate", validateToken);
router.get("/:username/forgot", forgotPassword);
router.put("/:resetToken/reset", resetPassword);
router.get("/admin-access/:loginId", authenticateAdmin, giveAdminAccess);

router.get("/admin-access/test/:loginId", giveAdminAccess);

// Movie Routes for all roles
router.get("/all", getAllMovies);
router.get("/search/:movieName", findByName);
//router.post("/add-new-movie", authenticateAdmin, addNewMovie);
router.post("/add-new-movie", authenticateAdmin, addNewMovie);

router.delete("/:movieName/delete", authenticateAdmin, deleteMovie);
router.get("/search-user/:userId", authenticateAdmin, getUserById);


router.get("/all-users/test", getAllUsers);

router.get("/all-users", authenticateAdmin, getAllUsers);
router.get("/about-me", authenticate, aboutMe);

// Actor routes

router.post("/add-actor", authenticateAdmin, addNewActor);
//router.post("/add-actor", authenticateAdmin, addNewActor);
router.get("/all-actors", getAllActors);
router.get("/search-actor/:actorId", getActorById);

// Add new distributors and there theatre
//authenticateAdmin is used to authenticate the admin
router.post("/add-new-theatre", authenticateAdmin, addNewTheatre);
router.put("/:movieName/update", authenticateAdmin, updateTickets);
router.get("/search-theatre/:theatreId", getTheatreById);
router.get("/all-theatre", getAllTheatre);

//Booking route
//  authenticate, is used to authenticate the user
router.post("/:movieName/add", authenticate, bookTicket);
router.get("/my-bookings", authenticate, getMyBookings);
router.get("/all-bookings", authenticateAdmin, getAllBookings);
router.delete("/:movieName/delete", authenticateAdmin, deleteMovie);
router.get(
  "/seats-booked/:theatreId/:showTime/:movieName",
  authenticate,
  getBookedSeats
);

//If the path is not found then
router.all("/*", async (req, res) => {
  res.status(404).json({ message: "Invalid Path" });
});

module.exports.router = router;

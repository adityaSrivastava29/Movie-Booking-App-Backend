const asyncHandler = require("../middleware/asyncHandler.middleware");
const {
  addNewTheatre,
  getAllTheatres,
  getTheatreById,
} = require("../service/theatre.service");

exports.addNewTheatre = asyncHandler(async (req, res) => {
  await addNewTheatre(req.body).then((result) =>
    res.status(201).json({ payload: result , message: "Theatre added successfully"})
  );
});

exports.getAllTheatre = asyncHandler(async (req, res) => {
  await getAllTheatres().then((result) => res.json({ payload: result }));
});

exports.getTheatreById = asyncHandler(async (req, res) => {
  console.log("Theatre details fetched successfully " + req.params.theatreId)
  await getTheatreById(req.params.theatreId).then((result) => {
    //log.info("Theatre details fetched successfully" + result);
    console.log("Theatre details fetched successfully result " + result)
    res.json({ payload : result })
  }
   
  );
});
